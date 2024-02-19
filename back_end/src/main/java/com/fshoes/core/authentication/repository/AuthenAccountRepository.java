package com.fshoes.core.authentication.repository;

import com.fshoes.entity.Account;
import com.fshoes.repository.AccountRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenAccountRepository extends AccountRepository {
    Optional<Account> findByEmail(String email);
}
