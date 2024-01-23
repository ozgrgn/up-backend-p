const axios = require("axios").default;
const moment = require("moment");
const xml2json = require("xml2json");
const { Invoice } = require("../invoice/model/index");

var Buffer = require("buffer/").Buffer;

const Model = require("./model");

let apiUrl = `https://pb.elogo.com.tr/PostBoxService.svc`;
let username = "****";
let password = "****";


const readable = require("stream").Readable;
const fs = require("fs");
const decompress = require("decompress");

const getDocument = async () => {
  let action = "GetDocument";

  let sessionId = await getSessionId();
  let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"
              xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
              <soapenv:Header/>
              <soapenv:Body>
              <tem:GetDocument>
              <!--Optional:-->
              <tem:sessionID>${sessionId}</tem:sessionID>
              <!--Optional:-->
              <tem:paramList>
              <!--Zero or more repetitions:-->
              <arr:string>DOCUMENTTYPE=APPLICATIONRESPONSE</arr:string>
              </tem:paramList>
              </tem:GetDocument>
              </soapenv:Body>
              </soapenv:Envelope>`;

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `http://tempuri.org/IPostBoxService/${action}`,
    },
    data: data,
  };

  try {
    let response = await axios(config);

    let jsonResponse = JSON.parse(xml2json.toJson(response.data));

    let value =
      jsonResponse["s:Envelope"]["s:Body"]["GetDocumentResponse"].document[
        "a:binaryData"
      ]["a:Value"];
    if (
      jsonResponse["s:Envelope"]["s:Body"]["GetDocumentResponse"][
        "GetDocumentResult"
      ]["a:resultCode"] == 0
    ) {
      return;
    }

    let fileName =
      jsonResponse["s:Envelope"]["s:Body"]["GetDocumentResponse"].document[
        "a:fileName"
      ];
    console.log(fileName, "fileName");
    fileName = fileName ? fileName.replace(".zip", ".xml") : null;

    await new Promise((resolve, reject) => {
      const fileBuffer = Buffer.from(value, "base64");
      const stream = new readable();
      stream.push(fileBuffer);
      stream.push(null);
      stream.pipe(fs.createWriteStream("base64Data.zip"));
      stream.on("end", () => {
        console.log("end");
        resolve();
      });
    });

    console.log("after");
    await decompress("base64Data.zip", ".");

    let faturaNo = await new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, data) => {
        let faturaNo = JSON.parse(xml2json.toJson(data.toString()))[
          "ApplicationResponse"
        ]["cbc:Note"][2];

        faturaNo = faturaNo ? faturaNo.split("No:")[1] : null;
        resolve(faturaNo);
      });
    });
    let uuid = await new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, data) => {
        let uuid = JSON.parse(xml2json.toJson(data.toString()))[
          "ApplicationResponse"
        ]["cbc:UUID"];

        resolve(uuid);
      });
    });
    let approveDate = await new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, data) => {
        let approveDate = JSON.parse(xml2json.toJson(data.toString()))[
          "ApplicationResponse"
        ]["cbc:Note"][11];

        approveDate = approveDate ? approveDate.split("Zamanı:")[1] : null;
        console.log(new Date(approveDate).toISOString(), "approveDate");
        resolve(new Date(approveDate).toISOString());
      });
    });
    let approveNo = await new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, data) => {
        let approveNo = JSON.parse(xml2json.toJson(data.toString()))[
          "ApplicationResponse"
        ]["cac:DocumentResponse"]["cac:LineResponse"]["cac:Response"][
          "cbc:ReferenceID"
        ];

        resolve(approveNo);
      });
    });
    console.log(approveNo);
    console.log(faturaNo, "faturaNo");
    console.log(uuid, "uuid");
    console.log(approveDate, "approveDatess");
    console.log(approveNo, "approveNoooo");
    if (uuid && faturaNo && approveDate && approveNo) {
      console.log("getDocument Done");
      return {
        uuid: uuid,
        faturaNo: faturaNo,
        approveDate: approveDate,
        approveNo: approveNo,
      };
    } else return false;
  } catch (error) {
    throw new Error(error.message);
  }
};
const saveInvoice = async (uuid, faturaNo, approveDate, approveNo) => {
  console.log(uuid, faturaNo, approveDate, approveNo);
  try {
    let saved = await Invoice.updateOne(
      { invoiceMerged: faturaNo },
      {
        $set: {
          status: "CONFIRMED",
          uuid: uuid,
          approveDate: approveDate,
          approveNo: approveNo,
        },
      }
    );
    if (saved) console.log(uuid, faturaNo, approveDate, approveNo);
    return true;
  } catch (error) {
    // let isSaved = await Model.OutsideInvoice.findOne({ faturano: faturaNo });
    // let saveNow
    // try {
    //   if (!isSaved) {
    //     saveNow = await new Model.OutsideInvoice({ uuid: uuid, faturano: faturaNo }).save()
    //     if (saveNow)
    //       console.log("Invoice saved successed");
    //   } else {
    //     console.log("This invoice has been registered")
    //   }
    //   if (isSaved || saveNow) {
    //     getDocumentDone(uuid)
    //   }
    // }

    console.log("saveInvoice error:", error);
  }
};
const getSessionId = async () => {
  let action = "Login";
  var data = `<?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:efat="http://schemas.datacontract.org/2004/07/eFaturaWebService">
      <soapenv:Header/>
        <soapenv:Body>
            <tem:Login>
                  <tem:login>
                  <efat:appStr></efat:appStr>
                   <efat:passWord>${password}</efat:passWord>
                    <efat:source></efat:source>
                     <efat:userName>${username}</efat:userName>
                      <efat:version></efat:version>
                        </tem:login>
                      </tem:Login>
                    </soapenv:Body>
                  </soapenv:Envelope>
                  `;

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `http://tempuri.org/IPostBoxService/${action}`,
    },
    data: data,
  };

  try {
    let response = await axios(config);

    let jsonResponse = JSON.parse(xml2json.toJson(response.data));

    if (!jsonResponse["s:Envelope"]["s:Body"].LoginResponse.LoginResult) {
      throw new Error("error when trying to login");
    }

    return JSON.parse(xml2json.toJson(response.data))["s:Envelope"]["s:Body"]
      .LoginResponse.sessionID;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getDocumentDone = async (uuid) => {
  let action = "GetDocumentDone";

  let sessionId = await getSessionId();

  let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
  <soapenv:Header />
  <soapenv:Body>
      <tem:GetDocumentDone>
          <!--Optional:-->
          <tem:sessionID>${sessionId}</tem:sessionID>
          <!--Optional:-->
          <tem:uuid>${uuid}</tem:uuid>
          <!--Optional:-->
          <tem:paramList>
              <!--Zero or more repetitions:-->
              <arr:string>DOCUMENTTYPE=APPLICATIONRESPONSE</arr:string>
          </tem:paramList>
      </tem:GetDocumentDone>
  </soapenv:Body>
</soapenv:Envelope>`;

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `http://tempuri.org/IPostBoxService/${action}`,
    },
    data: data,
  };

  try {
    let response = await axios(config);

    let jsonResponse = JSON.parse(xml2json.toJson(response.data));
    if (
      jsonResponse["s:Envelope"]["s:Body"]["GetDocumentDoneResponse"][
        "GetDocumentDoneResult"
      ]["a:resultCode"] != "1"
    ) {
      throw new Error("error when trying to get GetDocumentDoneResponse");
    }

    console.log("getDocumentDone Done");
    return jsonResponse["s:Envelope"]["s:Body"]["GetDocumentDoneResponse"][
      "GetDocumentDoneResult"
    ]["a:resultCode"];
  } catch (error) {
    throw new Error(error.message);
  }
};
const syncInvoices = async (req, res) => {
  let document = await getDocument();
  // console.log(req, document, "aaa");

  if (document) {
    let saved = await saveInvoice(
      document.uuid,
      document.faturaNo,
      document.approveDate,
      document.approveNo
    );
    if (saved) {
      await getDocumentDone(document.uuid);
      await saveInvoice();
    }
  } else {
    if (req && res) {
      return res.json({ status: true });
    }
  }
};

module.exports = {
  getSessionId,
  getDocument,
  syncInvoices,
};
