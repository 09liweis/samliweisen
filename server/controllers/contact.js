const { sendResp, sendErr } = require("../helpers/request");
const Contact = require("../models/contact");

exports.findList = (req, resp) => {
  Contact.find()
    .sort("-groups")
    .then((contacts) => {
      return sendResp(resp, contacts);
    })
    .catch((err) => {
      handleError(resp, err);
    });
};

exports.add = (req, resp) => {
  const { name, group } = req.body;
  const contact = { name };
  if (group) {
    contact.groups = [group];
  }
  const newContact = new Contact(contact);
  newContact.save((err, contact) => {
    handleError(resp, err);
    console.log(contact);
    return sendResp(resp, contact);
  });
};

exports.update = (req, resp) => {
  const { name, group } = req.body;
  const updateContact = { name };
  if (group) {
    updateContact.groups = group;
  }
  updateContact.mt = new Date();
  Contact.findOneAndUpdate(
    { _id: req.params.id },
    updateContact,
    { upsert: true },
    (err, contact) => {
      handleError(resp, err);
      return sendResp(resp, contact);
    },
  );
};

exports.remove = (req, resp) => {
  Contact.remove({ _id: req.params.id }, (err) => {
    handleError(resp, err);
    return sendResp(resp, "ok");
  });
};

function handleError(resp, err) {
  if (err) {
    return sendErr(resp, err);
  }
}
