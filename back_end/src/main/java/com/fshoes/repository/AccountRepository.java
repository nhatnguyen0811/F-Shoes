package com.fshoes.repository;

import com.fshoes.entity.Account;
import com.fshoes.infrastructure.constant.RoleAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);

    Optional<Account> findByPhoneNumber(String phoneNumber);

    Optional<Account> findByEmailAndPassword(String email, String password);

    Integer countAllByRole(RoleAccount roleAccount);
}
