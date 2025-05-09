package Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestParam String userLoginId) {
       
        return userLoginId + "님 환영합니다";
    }
    

}
