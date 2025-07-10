 var f1=document.getElementById("vb_lienhe");
            var Email=document.getElementById("vb_Email");
            var user=document.getElementById("vb_ten");
            var nd=document.getElementById("vb_nd");
            var reg=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

            function formtest(a)
            {
                if (ten.value.length <= 4)
                {
                    alert("Tên phải lớn hơn 4 ký tự");
                    return flase;
                }
                if(reg.test(email.value)==false)
                {
                     alert("Vui lòng nhập email hợp lệ!");
                     return false;
                }
                if (nd.value.length <= 10)
                {
                    alert("Nội dung lớn hơn 10 ký tự");
                    return false;
                }
                
                return true;
                
            }