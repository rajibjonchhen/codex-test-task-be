export default async function (req, res) {
    const hash = req.query.hash
    const user = await UserModel.findById(userId);
    if(!hash){
        return res.status(401).send({error:"cannot validate user"})
    }

    const response = await fetch(`http://localhost:3001/users/activate/${hash}`)
    if (response.status >= 400) {
        return res.status(401).send({error:"cannot validate user"})
    }else{
        res.writeHead(307,{location:"/users/activated"})
    }
}