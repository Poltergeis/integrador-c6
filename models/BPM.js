import sequelize from "../database/connectToDatabase.js";
import { DataTypes } from "sequelize";

const BPMModel = sequelize.define("BPM", {
    bpm: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false
    }

}, {
    tableName: 'BPM',
    timestamps: false
});

export default BPMModel;