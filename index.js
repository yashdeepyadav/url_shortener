const express = require('express')
const mongoose = require('mongoose')
const UrlData = require('./model/short')
const app = express()


mongoURI =  "mongodb+srv://ydy343:Yash%40343@cluster0.6marr.mongodb.net/?retryWrites=true&w=majority"

mongoose .connect(mongoURI, { useNewUrlParser: true }) .then(() => console.log("MongoDB connected")) .catch((err) => console.log(err));

app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/',async (req,res)=>{
  res.redirect('/home')
})

app.get('/home',async (req,res)=>{
  res.render('home',{check:'home'})
})

app.get('/search',async (req,res)=>{
  const check = await UrlData.findOne({full:req.query.searchbar})

  if(check==null){
  res.render('error',{check:'#'})
}else{
  res.redirect('/db/'+check.counter)
}
})

app.get('/allurls',async (req,res)=>{
  let pg = parseInt(req.query.page)||1

  const limit =10;
  const data = await UrlData.find().limit(limit).skip((pg-1)*limit)
  const total = await UrlData.find().count()
  let prev =pg-1;
  let next =pg+1;
  let curr =pg;
  if(pg===1){
    prev=null;
  }

  if((pg*10)>=total){
    next=null
  }
  res.render('allurls',{check:'db',data:data,curr,prev,next})
})

app.get('/about',async (req,res)=>{
  res.render('about',{check:'about'})
})

app.get('/:short',async (req,res)=>{
  const data = await UrlData.findOneAndUpdate({short:req.params.short},{$inc:{clicks:1}})
  if(data == null){
    res.render('error',{check:'#'});
  }else{
    res.redirect('/db/'+data.counter)
  }
}

)

app.get('/db/:counter',async (req,res)=>{
  const data = await UrlData.findOne({counter:req.params.counter})
  if(data == null){
    res.render("error",{check:'#'});
  }else{
    res.render('success',{data:data,check:'#'});
  }
}

)

app.post('/short',async (req,res)=>{

  const check = await UrlData.findOne({full:req.body.fullUrl})

  if(check==null){

    const olddata = await UrlData.findOne().sort({createdAt:-1}).limit(1)

  if(olddata == null){
    res.render("error",{check:'#'});
  }else{

    const n = olddata.counter+1;

    var base62set =  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const encode = (input) => {
      if (input === 0) {
        return 0;
      }
      let s = [];
      while (input > 0) {
        s = [base62set[input % 62],...s];
        input = Math.floor(input / 62);
      }
       return s.join('');
    };

    const short=encode(n)


    await UrlData.create({full:req.body.fullUrl,short:short,counter:n})
    .then(()=>{
      res.redirect('/db/'+n)
    })
    .catch(()=>{
      res.render("error",{check:'#'});
    })


  }

  }else{
    res.redirect('/db/'+check.counter)
  }


})

app.listen(process.env.PORT || 4000,()=>{
  console.log('server started')
})