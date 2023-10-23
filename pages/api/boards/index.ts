import { dbConnectBoard } from "../../../src/commons/libraries/dbConnect";
import BoardModel from "../../../src/commons/libraries/board.model";

export default async function handler(req, res) {
  const conn = await dbConnectBoard();
  const Board = BoardModel(conn);

  if (req.method === "POST") {
    const board = new Board(req.body);
    const savedBoard = await board.save();
    res.status(200).json(savedBoard);
  } else if (req.method === "GET") {
    try {
      if (req.query.num) {
        console.log(req.query.num);
        const boards = await Board.find({ num: req.query.num }).exec();
        res.status(200).json(boards);
      } else {
        const boards = await Board.find({}).exec();
        res.status(200).json(boards);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      if (req.query.title) {
        const { title, content, idx, author, date, views, likes } = req.body;

        const updatedDevice = await Board.findOneAndUpdate(
          { num: idx },
          {
            title,
            num: idx,
            content,
            author,
            date,
            views,
            likes,
          },
          { new: true }
        );

        if (!updatedDevice) {
          res.status(404).json({ message: "Device not found" });
          return;
        }

        res.status(200).json(updatedDevice);
      } else if (req.query.likes) {
        const { num } = req.body;
        const updatedCounter = await Board.findOneAndUpdate({ num: num }, { $inc: { likes: 1 } }, { new: true });

        if (!updatedCounter) {
          res.status(404).json({ message: "Device not found" });
          return;
        }

        res.status(200).json(updatedCounter);
      } else {
        const { num } = req.body;
        const updatedCounter = await Board.findOneAndUpdate({ num: num }, { $inc: { views: 1 } }, { new: true });

        if (!updatedCounter) {
          res.status(404).json({ message: "Device not found" });
          return;
        }

        res.status(200).json(updatedCounter);
      }
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { num } = req.body;
      const result = await Board.deleteOne({ num });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Device not found" });
        return;
      }

      res.status(200).json({ message: "Device successfully deleted" });
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
