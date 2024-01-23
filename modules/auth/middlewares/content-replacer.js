module.exports = (where, key) => {
  return async (req, res, next) => {
    let content = req[where][key];

    console.log(content, "--- önce");
    content = content.replaceAll("<font", "<p");
    content = content.replaceAll("</font", "</p");
    content = content.replaceAll("<u", "<p");
    content = content.replaceAll("</u", "</p");
    content = content.replaceAll("<b", "<p");
    content = content.replaceAll("</b", "</p");
    content = content.replaceAll("<div", "<p");
    content = content.replaceAll("</div", "</p");
    content = content.replaceAll('class="MsoNormal"', "");
    content = content.replaceAll('face="Times New Roman"', "");
    content = content.replaceAll('o:p', "p");
    content = content.replaceAll('align="center"', "");
    
  
    

    
    
    console.log(content, "---2222");
    req[key] = content;

    return next();
  };
};
