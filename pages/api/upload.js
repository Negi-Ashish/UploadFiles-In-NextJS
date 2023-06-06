import multer from 'multer';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
// Configure Sequelize
const sequelize = new Sequelize('MEDIUM', 'root', 'root', {
  host: "127.0.0.1",
  dialect: 'mysql',
});

// Define the File model
const UPLOAD = sequelize.define('Upload', {
  filename: {
    type: DataTypes.STRING,
  },
  mimetype: {
    type: DataTypes.STRING,
  },
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });

  const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      console.log("here")
      cb(null,path.join(process.cwd(), './public/uploads'));

    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);

    },
 
  }
  );
  
  const upload = multer({ storage });
  export const config = {
    api: {
      bodyParser: false
    },
  };
  
  export default async function handler(req,res) {
    if (req.method === 'POST') {
      upload.single('file')(req, res, async (err) => {
        if (err) {
          console.error('Error uploading file:', err);
          return res.status(500).send('Internal Server Error');
        }
  
        if (!req.file) {
          console.error('No file uploaded');

          return res.status(400).send('No file uploaded');
        }

        const { filename, mimetype } = req.file;
        console.log('file',req.file)
        
        try {
          const createdFile = await UPLOAD.create({
            filename,
            mimetype,
          });
  
          res.status(200).send('File uploaded successfully');
        } catch (err) {
          console.error('Error saving file to the database:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    } else {
      res.status(405).send('Method Not Allowed');
    }
  }




//here

