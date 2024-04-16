const domain="http://localhost:8088/";

async function get(path){
  const resp= await fetch(
      domain+path,{
          method:"GET",
      }
  );
  return resp;
}

async function remove(path,body){
  const resp= await fetch(domain+path,
       {
           method:"DELETE",
           headers:{
              "content-type": "application/json"
           },
           body:JSON.stringify(body)
       }
   );
   return resp;
}

async function save(path,body){
  const resp=await fetch(domain+path,{
      method:"POST",
      headers:{
        "content-type": "application/json"
      },
      body:JSON.stringify(body)
  });
  return resp;
}

async function update(path,body){
  const resp= await fetch(domain+path,
       {
           method:"PUT",
           headers:{
              "content-type" : "application/json"
           },
           body:JSON.stringify(body)
       }
   );
   return resp;
}

export default{save,get,remove,update}
