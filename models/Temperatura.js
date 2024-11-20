import sequelize from "../database/connectToDatabase.js";
import { DataTypes } from "sequelize";

const TempModel = sequelize.define("BPM", {
    temperatura: {
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
    tableName: 'temperaturas',
    timestamps: false
});

export default TempModel;