const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const authRoutes = require("./authController");
require('dotenv').config();

const app = express();
const User = require("./User");

app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta 'uploads/'
app.use('/upload', express.static(path.join(__dirname, 'upload')));


// Configurar multer para almacenar archivos con su nombre original
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/'); // Carpeta donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usar el nombre original del archivo
  }
});

const upload = multer({ storage: storage });


const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Conexión exitosa a mongoDB"))
    .catch((error) => console.error("Error al conectar a la base de datos", error));




// Usar las rutas de autenticación
app.use('/auth', authRoutes);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
});

// Ruta para obtener la información de un usuario por su ID
// En el backend (por ejemplo, Express.js)
app.get('/api/items', async (req, res) => {
    const { userId } = req.query;
    try {
        const items = await Item.find({ userId });  // Busca productos por el userId
        res.json(items);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});


app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;

    // Consulta a la base de datos para obtener la información del usuario
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);  // Devolver los datos del usuario
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la información del usuario' });
        });
});


// Modelo de ingreso de items
const Item = mongoose.model("products", new mongoose.Schema({
    nameItem: { type: String, required: true },
    descriptionItem: { type: String, required: true },
    priceItem: { type: Number, required: true },
    quantityItem: { type: Number, required: true },
    image: { type: String, required: true },  // Almacenar solo la URL de la imagen
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Asocia cada producto con el ID del usuario

}));

// Suponiendo que ya tienes un modelo de Producto (Product) y un esquema que incluye el email del vendedor
app.get('/items', (req, res) => {
    const { userId } = req.query; // Asegúrate de que userId esté siendo pasado correctamente
    if (!userId) {
        return res.status(400).json({ error: 'Se requiere userId' });
    }

    // Ejemplo de consulta a la base de datos (suponiendo que usas MongoDB o alguna otra base de datos)
    Item.find({ userId })
        .then(items => {
            res.json(items); // Devolver los productos como JSON
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        });
});

app.get('/products', (req, res) => {
    // Ejemplo de consulta a la base de datos (suponiendo que usas MongoDB o alguna otra base de datos)
    Item.find()
        .then(items => {
            res.json(items); // Devolver los productos como JSON
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        });
});



// Ruta para agregar un nuevo producto
// Ruta para agregar un nuevo producto
app.post('/items', upload.single('image'), async (req, res) => {
    console.log('File:', req.file); // Verifica qué archivo se está recibiendo
    if (!req.file) {
        return res.status(400).json({ message: 'Por favor, selecciona una imagen.' });
    }

    // Obtener `userId` ya sea desde el cuerpo de la solicitud o desde los headers
    const userId = req.body.userId || req.headers['x-user-id'];
    const { nameItem, descriptionItem, priceItem, quantityItem } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'Usuario no autenticado.' });
    }

    // Utilizar el nombre original del archivo para formar la URL
    const imageUrl = `http://localhost:5008/upload/${req.file.originalname}`;

    try {
        const newItem = new Item({
            nameItem,
            descriptionItem,
            priceItem,
            quantityItem,
            image: imageUrl,  // Almacenar la URL de la imagen con el nombre original
            userId            // Asociar el producto al usuario
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ message: 'Hubo un error al agregar el producto.' });
    }
});









// Ruta para actualizar productos
app.put("/items/:id", upload.single('image'), async (req, res) => {
    try {
        const { nameItem, descriptionItem, priceItem, quantityItem } = req.body;
        let updatedData = { nameItem, descriptionItem, priceItem, quantityItem };

        if (req.file) {
            updatedData.image = `http://localhost:5008/upload/${req.file.originalname}`;  // Actualizar la URL de la imagen
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedItem);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Hubo un error al actualizar el producto.' });
    }
});


// Eliminar productos
app.delete("/items/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
