userCart:(req,res)=>{
    let user;
    if(req.session.user){
      user=req.session.user._id;
      let username=req.session.user.username
      console.log('user session details :',user);
    }
    
        userhelpers.getCartProducts(user).then(async(cartitems)=>{
          console.log("aggregation response : ",cartitems);
          // console.log(cartitems[0].proDetails);
          console.log('you caaaan doi it');
          let cartTotal = await userhelpers.getTotalAmount(user)
          let proCount = await userhelpers.getCartCount(user);
          if(proCount){
            res.render('user/cart',{productExist:true,products:cartitems,proCount,cartTotal,loginheader:true,username})
          }
         else{
          console.log(proCount,"procount:");
          res.render('user/cart',{productExist:false,loginheader:true})
         }
          
        
        })
       },