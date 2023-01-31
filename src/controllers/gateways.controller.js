import { pool } from "../db.js";

export const getGateways = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gateway");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Connection Error",
    });
  }
};

export const getGateway = async (req, res) => {
  try {
    const [[rows]] = await pool.query(
      "SELECT * FROM gateway where idGateway = ?",
      [req.params.id]
    );
    if (!rows)
      return res.status(404).json({
        message: "Gateway not found",
      });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Connection Error",
    });
  }
};

export const createGateways = async (req, res) => {
  const { serialNumber, humanName, ip } = req.body;
  try {
    const [[serialRepeated]] = await pool.query(
      "SELECT COUNT(*) as counter FROM gateway where serialNumber = ?",
      [serialNumber]
    );

    const [[ipRepeated]] = await pool.query(
      "SELECT COUNT(*) as counter FROM gateway where ip = ?",
      [ip]
    );

    const regExp =
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const isIpValidated = regExp.test(ip);

    if (!isIpValidated)
      return res.status(400).json({
        message: "Incorrect IPv4 address. Ex: '127.0.0.0'",
      });

    if (ipRepeated["counter"] > 0)
      return res.status(400).json({
        message:
          "There's already a gateway with this IPv4 address. The gateway you enter must have a unique IPv4 address.",
      });

    if (serialRepeated["counter"] > 0)
      return res.status(400).json({
        message:
          "There's already a gateway with this serial number. The gateway you enter must have a unique serial number.",
      });

    const [rows] = await pool.query(
      "INSERT INTO gateway (serialNumber, humanName, ip) VALUE (?,?,?)",
      [serialNumber, humanName, ip]
    );

    res.send({ idGateway: rows.insertId, serialNumber, humanName, ip });
  } catch (error) {
    return res.status(500).json({
      message: "Connection Error",
    });
  }
};

export const updateGateways = async (req, res) => {
  const { serialNumber, humanName, ip } = req.body;

  try {
    const [[serialRepeated]] = await pool.query(
      "SELECT COUNT(*) as counter FROM gateway where serialNumber = ? and idGateway <> ?",
      [serialNumber, req.params.id]
    );

    const [[ipRepeated]] = await pool.query(
      "SELECT COUNT(*) as counter FROM gateway where ip = ? and idGateway <> ?",
      [ip, req.params.id]
    );

    const regExp =
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const isIpValidated = regExp.test(ip);

    if (!isIpValidated)
      return res.status(400).json({
        message: "Incorrect IPv4 address. Ex: '127.0.0.0'",
      });

    if (ipRepeated["counter"] > 0)
      return res.status(400).json({
        message:
          "There's already a gateway with this IPv4 address. The gateway you enter must have a unique IPv4 address.",
      });

    if (serialRepeated["counter"] > 0)
      return res.status(400).json({
        message:
          "There's already a gateway with this serial number. The gateway you enter must have a unique serial number.",
      });

    const [result] = await pool.query(
      "UPDATE gateway SET serialNumber = ?, humanName = ?, ip = ? where idGateway = ? ",
      [serialNumber, humanName, ip, req.params.id]
    );

    if (!result.affectedRows)
      return res.status(404).json({
        message: "Gateway not found",
      });

    const [row] = await pool.query(
      "SELECT * FROM gateway where idGateway = ?",
      [req.params.id]
    );

    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Connection Error",
    });
  }
};

export const deleteGateways = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM gateway WHERE idGateway = ?",
      [id]
    );

    if (!result.affectedRows)
      return res.status(404).json({
        message: "Gateway not found",
      });

    const [[rows]] = await pool.query(
      "SELECT COUNT(*) AS counter FROM device WHERE idGateway = ?",
      [id]
    );

    if (rows.counter > 0) {
      await pool.query("DELETE FROM device WHERE idGateway = ?", [id]);
    }
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      message: "Connection Error",
    });
  }
};
