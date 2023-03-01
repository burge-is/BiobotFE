import KITS_SHIPPING_DATA from "../data/KITS_SHIPPING_DATA.json";

// TODO: Connect to database
const getKitsShippingData = (offset = 0, limit = KITS_SHIPPING_DATA.length, filter) => {
  const matchingKits = filter ?
    KITS_SHIPPING_DATA.filter((kit) => kit.label_id.indexOf(filter) === 0)
    : KITS_SHIPPING_DATA;

  return matchingKits.slice(offset, offset + limit);
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { offset, limit, filter } = req.query;
      res.status(200).json(getKitsShippingData(offset, limit, filter));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}