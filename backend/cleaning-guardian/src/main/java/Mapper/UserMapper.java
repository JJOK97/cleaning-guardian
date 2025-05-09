package Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import DTO.UserDTO;


@Mapper
public interface UserMapper {

@Insert("INSERT INTO users (userLoginId, nickname) VALUES (#{userLoginId}, #{nickname})")
void insertuser(UserDTO user);



@Select("SELECT userLoginId FROM users")
List<String> GetalluserLoginIds();      // 중복 체크용 모든 아이디 가져오기
}
