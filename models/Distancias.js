import sequelize from "../database/connectToDatabase.js";
import { DataTypes } from "sequelize";

const DistanciaModel = sequelize.define("distancias", {
    distancia: {
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
    tableName: 'Distancias',
    timestamps: false,
    primaryKey: false
});

export default DistanciaModel;