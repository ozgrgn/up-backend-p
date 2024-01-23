const OthersService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const _ = require("lodash");
// Campaigns
const getCampaigns = async (req, res) => {
  const [campaign_err, campaigns] = await promiseHandler(
    OthersService.getCampaigns()
  );
  if (campaign_err) {
    return res.json({ status: false, message: campaign_err });
  }

  return res.json({ status: true, campaigns });
};

const addCampaign = async (req, res) => {
  console.log(req.body);
  const [campaign_err, campaign] = await promiseHandler(
    OthersService.addCampaign(req.body.campaign)
  );
  if (campaign_err) {
    return res.json({ status: false, message: campaign_err });
  }

  return res.json({ status: true, campaign });
};

const deleteCampaign = async (req, res) => {
  const [err, campaign] = await promiseHandler(
    OthersService.deleteCampaign(req.params.id)
  );
  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: campaign });
};
// Terminals
const getTerminals = async (req, res) => {
  const [terminal_err, terminals] = await promiseHandler(
    OthersService.getTerminals()
  );
  if (terminal_err) {
    return res.json({ status: false, message: terminal_err });
  }

  return res.json({ status: true, terminals });
};

const addTerminal = async (req, res) => {
  console.log(req.body);
  const [terminal_err, terminal] = await promiseHandler(
    OthersService.addTerminal(req.body.terminal)
  );
  if (terminal_err) {
    return res.json({ status: false, message: terminal_err });
  }

  return res.json({ status: true, terminal });
};

const deleteTerminal = async (req, res) => {
  const [err, terminal] = await promiseHandler(
    OthersService.deleteTerminal(req.params.id)
  );
  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: terminal });
};
// Reasons
const getReasons = async (req, res) => {
  const [reason_err, reasons] = await promiseHandler(
    OthersService.getReasons()
  );
  if (reason_err) {
    return res.json({ status: false, message: reason_err });
  }

  return res.json({ status: true, reasons });
};

const addReason = async (req, res) => {
  console.log(req.body);
  const [reason_err, reason] = await promiseHandler(
    OthersService.addReason(req.body.reason)
  );
  if (reason_err) {
    return res.json({ status: false, message: reason_err });
  }

  return res.json({ status: true, reason });
};

const deleteReason = async (req, res) => {
  const [err, reason] = await promiseHandler(
    OthersService.deleteReason(req.params.id)
  );
  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: reason });
};

const getAirlines = async (req, res) => {
  const [airlines_err, airlines] = await promiseHandler(
    OthersService.getAirlines()
  );
  if (airlines_err) {
    return res.json({ status: false, message: airlines_err });
  }

  return res.json({ status: true, airlines });
};
const getAirports = async (req, res) => {
  const [airports_err, airports] = await promiseHandler(
    OthersService.getAirports()
  );
  if (airports_err) {
    return res.json({ status: false, message: airports_err });
  }

  return res.json({ status: true, airports });
};
const getAgencies = async (req, res) => {
  const [agencies_err, agencies] = await promiseHandler(
    OthersService.getAgencies()
  );
  if (agencies_err) {
    return res.json({ status: false, message: agencies_err });
  }

  return res.json({ status: true, agencies });
};
module.exports = {
  getCampaigns,
  addCampaign,
  deleteCampaign,
  getReasons,
  addReason,
  deleteReason,
  getAirlines,
  getAgencies,
  getAirports,
  getTerminals,
  addTerminal,
  deleteTerminal
  
};
