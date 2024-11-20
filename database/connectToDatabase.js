import signale from "signale";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


const sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql"
});

/**
 * @returns { Promise<boolean> }
 */
export async function connectToDatabase() {
    try {
        await sequelize.authenticate().then(() => {
            signale.info("connection to database established successfully");
        });
        return true;
    } catch (e) {
        signale.info("connection to database crashed before starting.\n" + e);
        return false;
    }
}

export default sequelize;