import dotenv from 'dotenv'
import app from "./app"

dotenv.config()
const PORT = process.env.PORT;

try {
    app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
} catch (err) {
    console.log(`Server connection error ${PORT}`)
}
