const express= require('express')
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port =process.env.PORT || 5000;

// MiddleWare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he8foru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const craftCollection=client.db('craftStore').collection('crafts')


    app.get('/crafts',async(req,res)=>{
      const cursor=craftCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/crafts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await craftCollection.findOne(query)
      res.send(result)
    })

    app.get('/singleCraft/:id',async(req,res)=>{
      console.log(req.params.id)
      const result=await craftCollection.findOne({_id:new ObjectId(req.params.id)})
      res.send(result)
    })

    app.get('/myCraft/:email',async(req,res)=>{
      console.log(req.params.email)
      const result=await craftCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    app.post('/crafts',async(req,res)=>{
      console.log(req.body)
      const result=await craftCollection.insertOne(req.body);
      console.log(result)
      res.send(result)
    })

    app.put('/updateCraft/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(req.params.id)}
      const craft={
        $set:{
          name:req.body.name,
          email:req.body.email,
          itemName:req.body.itemName,
          photo:req.body.photo,
          subcategory:req.body.subcategory,
          rating:req.body.rating,
          price:req.body.price,
          description:req.body.description,
          customization:req.body.customization,
          processTime:req.body.processTime,
          status:req.body.status,
        }
      }
      const result=await craftCollection.updateOne(query,craft)
      console.log(result)
      res.send(result)
    })

    app.delete('/myCrafts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await craftCollection.deleteOne(query)
      res.send(result)
    })
  

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Lumina arts and craft server is running')
})
app.listen(port,()=>{
    console.log(`Lumina art and craft is running on port: ${port} `)
})