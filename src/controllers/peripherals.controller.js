import { pool } from "../db.js";

export const getPerpherals = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Peripheral");
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const getPerpheral = async (req, res) => {
    try {
        const { id } = req.params;

        const [[countId]] = await pool.query("SELECT COUNT(*) AS counter FROM peripheral WHERE idPeripheral = ?", [id])

        if (countId.counter === 0) {
            return res.status(404).json({
                message: "Endpoint not found!"
            })
        }

        const [[rows]] = await pool.query("SELECT * FROM Peripheral WHERE idPeripheral = ?", [id]);
        res.json(rows);

    } catch (error) {
        return res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const createPeripherals = async (req, res) => {
    try {
        const { nameP } = req.body;

        const [[counterSameName]] = await pool.query("SELECT COUNT(*) as counter FROM peripheral WHERE nameP = ?", [nameP])

        if (counterSameName.counter > 0) {
            return res.status(400).json({
                message: "This peripheral's name already exists. Please, try another name."
            })
        }

        const [row] = await pool.query("INSERT INTO peripheral (nameP) VALUES (?)", [nameP])

        res.json({ idPeripheral: row.insertId, nameP });
    } catch (error) {
        return res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const updatePeripherals = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameP } = req.body;

        const [[counterExistId]] = await pool.query("SELECT COUNT(*) as counter FROM peripheral WHERE idPeripheral = ?", [id])

        if (counterExistId.counter === 0) {
            return res.status(404).json({
                message: "Endpoint not found!"
            })
        }

        const [[counterSameName]] = await pool.query("SELECT COUNT(*) as counter FROM peripheral WHERE nameP = ? and idPeripheral <> ?", [nameP, id])

        if (counterSameName.counter > 0) {
            return res.status(400).json({
                message: "This peripheral's name already exists. Please, try another name."
            })
        }

        await pool.query("UPDATE peripheral SET nameP = ? WHERE idPeripheral = ?", [nameP, id])

        const [[row]] = await pool.query("SELECT * FROM peripheral WHERE idPeripheral = ?", [id])

        res.json(row)
    } catch (error) {
        return res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const deletePeripherals = async (req, res) => {
    try {
        const { id } = req.params;

        const [[counterExistId]] = await pool.query("SELECT COUNT(*) as counter FROM peripheral WHERE idPeripheral = ?", [id])

        if (counterExistId.counter === 0) {
            return res.status(404).json({
                message: "Endpoint not found!"
            })
        }

        await pool.query("DELETE FROM peripheral WHERE idPeripheral = ?", [id])

        res.sendStatus(202);
    } catch (error) {
        return res.status(500).json({
            message: "Connection Error!"
        })
    }
}