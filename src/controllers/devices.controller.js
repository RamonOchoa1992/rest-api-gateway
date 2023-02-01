import { pool } from "../db.js"

export const getDevices = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM device");

        const result = rows.map(el => {
            const date = `${el.Date_Created.getFullYear()}-${(el.Date_Created.getMonth() + 1) > 9 ? (el.Date_Created.getMonth() + 1) : "0" + (el.Date_Created.getMonth() + 1)}-${el.Date_Created.getDate()}`
            return {
                ...el,
                Date_Created: date
            }
        })

        res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const getDevice = async (req, res) => {
    try {
        const { id } = req.params;

        const [[countId]] = await pool.query("SELECT COUNT(*) AS counter FROM device WHERE idDevice = ?", [id])

        if (countId.counter === 0) {
            return res.status(404).json({
                message: "Endpoint not found!"
            })
        }

        const [[row]] = await pool.query("SELECT * FROM device WHERE idDevice = ?", [id])

        const date = `${row.Date_Created.getFullYear()}-${(row.Date_Created.getMonth() + 1) > 9 ? (row.Date_Created.getMonth() + 1) : "0" + (row.Date_Created.getMonth() + 1)}-${row.Date_Created.getDate()}`

        const result = { ...row, Date_Created: date }

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const createDevice = async (req, res) => {
    try {
        const { IdGateway, IdPeripheral, Vendor, Date_Created, Status, UID } = req.body;

        const [[counterGateway]] = await pool.query("SELECT COUNT(*) as counter FROM device WHERE idGateway = ?", [IdGateway]);

        if (counterGateway.counter === 10) {
            return res.status(400).json({
                message: "No more that 10 peripheral devices are allowed for a gateway."
            })
        }

        const [[counterUID]] = await pool.query("SELECT COUNT(*) as counter FROM device WHERE UID = ?", [UID]);

        if (typeof UID !== "number") {
            return res.status(400).json({
                message: "This device's UID must be a number. Example: 2000. Please try it again."
            })
        }

        if (counterUID.counter > 0) {
            const [[IdGat]] = await pool.query("SELECT IdGateway FROM device WHERE UID = ?", [UID]);
            const [[serialN]] = await pool.query("SELECT serialNumber FROM gateway WHERE IdGateway = ?", [IdGat.IdGateway]);

            return res.status(400).json({
                message: `This device's UID is associated to a gateway with serial number: '${serialN.serialNumber}'. Please, check the device you enter has a unique UID.`
            })
        }

        const [row] = await pool.query("INSERT INTO device (IdGateway, IdPeripheral, Vendor, Date_Created, Status, UID) VALUES (?, ?, ?, ?, ?, ?)", [IdGateway, IdPeripheral, Vendor, Date_Created, Status, UID])

        res.json({ idDevice: row.insertId, IdGateway, IdPeripheral, Vendor, Date_Created, Status, UID })
    } catch (error) {
        res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { IdGateway, IdPeripheral, Vendor, Date_Created, Status, UID } = req.body;

        const [[counterGateway]] = await pool.query("SELECT COUNT(*) as counter FROM device WHERE idGateway = ?", [IdGateway]);

        if (counterGateway.counter === 10) {
            return res.status(400).json({
                message: "No more that 10 peripheral devices are allowed for a gateway."
            })
        }

        const [[countId]] = await pool.query("SELECT COUNT(*) AS counter FROM device WHERE idDevice = ?", [id])

        if (countId.counter === 0) {
            return res.status(404).json({
                message: "Endpoint not found!"
            })
        }

        const [[counterUID]] = await pool.query("SELECT COUNT(*) as counter FROM device WHERE UID = ? and idDevice <> ?", [UID, id]);

        if (typeof UID !== "number") {
            return res.status(400).json({
                message: "This device's UID must be a number. Example: 2000. Please try it again."
            })
        }

        if (counterUID.counter > 0) {
            const [[IdGat]] = await pool.query("SELECT IdGateway FROM device WHERE UID = ?", [UID]);
            const [[serialN]] = await pool.query("SELECT serialNumber FROM gateway WHERE IdGateway = ?", [IdGat.IdGateway]);

            return res.status(400).json({
                message: `This device's UID is associated to a gateway with serial number: '${serialN.serialNumber}'. Please, check the device you enter has a unique UID.`
            })
        }

        await pool.query("UPDATE device SET IdGateway = ?, IdPeripheral =?, Vendor=?, Date_Created=?, Status = ?, UID = ? WHERE idDevice = ?", [IdGateway, IdPeripheral, Vendor, Date_Created, Status, UID, id])

        const [[row]] = await pool.query("SELECT * FROM device WHERE idDevice = ?", [id])

        const date = `${row.Date_Created.getFullYear()}-${(row.Date_Created.getMonth() + 1) > 9 ? (row.Date_Created.getMonth() + 1) : "0" + (row.Date_Created.getMonth() + 1)}-${row.Date_Created.getDate()}`

        const result = { ...row, Date_Created: date }

        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Connection Error!"
        })
    }
}

export const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;

        const [[countId]] = await pool.query("SELECT COUNT(*) AS counter FROM device WHERE idDevice = ?", [id])

        if (countId.counter === 0) {
            return res.status(404).json({
                message: "Endpoint not found!"
            })
        }

        await pool.query("DELETE FROM device WHERE idDevice = ?", [id]);

        res.sendStatus(202)
    } catch (error) {
        res.status(500).json({
            message: "Connection Error!"
        })
    }
}