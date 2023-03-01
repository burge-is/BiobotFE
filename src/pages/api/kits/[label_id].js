import KITS_SHIPPING_DATA from "../data/KITS_SHIPPING_DATA.json";

// Make a fast lookup map
// TODO: Move this to a database that has fast lookup
const kitMap = new Map();
KITS_SHIPPING_DATA.forEach((kit) => {
  kitMap.set(kit.label_id, kit);
});

const getKitByLabelId = (labelId) => {
  return kitMap.get(labelId);
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { label_id } = req.query;
      res.status(200).json(getKitByLabelId(label_id));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}