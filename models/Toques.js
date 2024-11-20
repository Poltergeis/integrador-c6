import sequelize from "../database/connectToDatabase.js";
import { DataTypes } from "sequelize";

const ToqueModel = sequelize.define("distancias", {
    toque: {
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
    timestamps: false
});

export default ToqueModel;