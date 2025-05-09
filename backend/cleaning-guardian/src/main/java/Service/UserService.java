package Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DTO.UserDTO;
import Mapper.UserMapper;


@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public void register(String nickname){
        String userLoginId = UniqueGuestId();
        UserDTO user = new UserDTO();
        user.setUserLoginId(userLoginId);
        user.setNickname(nickname);
        userMapper.insertuser(user);
    }

    private String UniqueGuestId() {
        List<String> listIds = userMapper.GetalluserLoginIds();
        int count = 1;
        String id;
        do{
            id = String.format("%05dguest", count++);
        } while (listIds.contains(id));
        return id;
    }

}
