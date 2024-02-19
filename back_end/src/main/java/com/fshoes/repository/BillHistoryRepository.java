package com.fshoes.repository;

import com.fshoes.entity.BillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillHistoryRepository extends JpaRepository<BillHistory, String> {
    @Query(value = "SELECT * FROM bill_history WHERE id_bill = :id", nativeQuery = true)
    List<BillHistory> getBillHistorys(String id);
}
