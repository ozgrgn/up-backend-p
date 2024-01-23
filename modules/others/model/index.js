const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Campaign = mongoose.model("campaigns", CampaignSchema);



const TerminalSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Terminal = mongoose.model("terminals", TerminalSchema);

const AirportSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Airport = mongoose.model("airports", AirportSchema);

const AirlineSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Airline = mongoose.model("airlines", AirlineSchema);

const ReasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Reason = mongoose.model("reasons", ReasonSchema);

const AgencySchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Agency = mongoose.model("agencies", AgencySchema);


module.exports = {
  Campaign,
  Agency,
  Airport,
  Airline,
  Reason,
  Terminal
};
