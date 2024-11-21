import sequelize from "../database/connectToDatabase.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const UserModel = sequelize.define('User', {
    /*username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [3, 50]
        }
    },*/
    gmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [5, 255]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default UserModel;