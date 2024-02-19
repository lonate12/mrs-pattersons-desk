package com.hcc.services;

 import com.hcc.entities.Authority;
 import com.hcc.entities.User;
 import com.hcc.repositories.UserRepository;
 import com.hcc.utils.CustomPasswordEncoder;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.security.core.userdetails.UserDetails;
 import org.springframework.security.core.userdetails.UserDetailsService;
 import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

 import java.util.ArrayList;
 import java.util.List;


@Service
public class UserDetailServiceImpl implements UserDetailsService {
    @Autowired
    CustomPasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Note: Will need to use the below at some point in the future to retrieve a user from the DB, but, for now, are just going
        //  to hardcode the response to make sure it works
        // User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Could not find user: " + username));

        // Note: Hard coding values for a user, for now
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.getPasswordEncoder().encode("password"));
        return user;
    }
}
