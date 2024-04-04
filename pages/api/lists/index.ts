import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  // );
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  // );

  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  if (method === "OPTIONS") {
    return res.status(200).send("ok");
  }
  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { List } = await connect();
      res.json(await List.find({}).catch(catcher));
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { List } = await connect();
      res.json(await List.create(req.body).catch(catcher));
    },
  };

  const response = handleCase[method];
  if (response) {
    response(req, res);
  } else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
