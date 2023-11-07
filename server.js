var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
const { default: axios } = require('axios')
const app = express()

app.use(bodyParser.json())

//console.log('start')
const connect = async function(){
	mongoose.Promise = global.Promise;
    console.log('In connect')
	const result  = await mongoose.connect('mongodb://127.0.0.1:27017/xenon', {
	useNewUrlParser: true
	}).then(() => {
	console.log('Database sucessfully connected!')
	},
	error => {
		console.log('Could not connect to database : ' + error)
	}
	)}


app.get('/', (req,res)=>{
    console.log('Getting get go')
    res.send({msg: "test succesful"})
})

app.get('/xenodeList', (req,res) => {
console.log('getting list of xenodes')
const xenodes = [
    {
        "number":"Xenode 120",
        "name":"XenodeVirginia",
       
    },
    {   
        "number":"Xenode 129",
        "name":"XenodeFrankfurt",
        
    },
    {
        "number":"Xenode 132",
        "name":"XenodeSingapore",
        
    },
    {
        "number":"Xenode 87",
        "name":"XenodeSilicon",
        
    },
]
res.json({xenodes: xenodes})

})

app.post('/xenodeForm',async (req,res) => {
    
    // console.log({recievedReq: req.body})
    console.log("inside request")
    obj = {
        ip : req.body.ip
    }
    const{ xenodeNumber, userIp, location,   userWalletAddress} = req.body

    if(xenodeNumber == 'Xenode 120'){
        const reqResult = await axios.post('https://47.253.131.10:4000/ipWhitelist')
        console.log(reqResult)
        res.json({msg: "Ip Whitelist Success"})
    }
    else if(xenodeNumber ==  'Xenode 129'){
        const reqResult = await axios.post('https://8.211.42.222:4000/ipWhitelist')
        console.log(reqResult)
        res.json({msg: "Ip Whitelist Success"})
    }
    
    ///////////////////////////////////////////////////////////////////
    else if(xenodeNumber == 'Xenode 132'){
        const reqTest = await axios.get('http://8.219.49.161:4000/testSingapore')
        console.log(reqTest.data)
        
        const reqResult = await axios.post('http://8.219.49.161:4000/whiteListIp',obj)
        console.log(reqResult.data)
        res.json({msg: "Ip Whitelist Success"})
    }

    ///////////////////////////////////////////////////////////////////////////////////
    else if(xenodeNumber == 'Xenode 87'){

        // const reqResult = await axios.post('https://47.89.249.220:4000/ipWhitelist')

        const reqResult = await axios({
            method: 'post',
            url: 'https://47.89.249.220:4000/whiteListIp/',
            params: {
              ip_request: userIp, // This is the body part
            }
          });

        // const reqResult = await axios.post('http://localhost:5000/whiteListIp',{"ip_request": req.body.ip})
        console.log(reqResult)
        res.json({msg: "Ip Whitelist Success"})
    }
    else {res.json({msg : "Provided xenode does not exist in cluster"})}

})


app.post('/whiteListIp', (req,res) =>{
    const { exec } = require('child_process');

    exec('sudo ufw allow from '+req.query.ip_request, (err, stdout, stderr) => {
        if (err) {      
        console.log("Server got error ::  " + err)
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    });
    res.json({msg: 'User created', request: "Response"})

})

const port = 5000
// connect();
app.listen(port,  () => {console.log("Server listening at "+ port )})