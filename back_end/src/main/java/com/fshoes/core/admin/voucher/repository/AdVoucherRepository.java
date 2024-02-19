package com.fshoes.core.admin.voucher.repository;

import com.fshoes.core.admin.khachhang.model.respone.KhachHangRespone;
import com.fshoes.core.admin.voucher.model.request.AdCallVoucherOfSell;
import com.fshoes.core.admin.voucher.model.request.AdVoucherSearch;
import com.fshoes.core.admin.voucher.model.respone.AdCustomerVoucherRespone;
import com.fshoes.core.admin.voucher.model.respone.AdFindCustomerRespone;
import com.fshoes.core.admin.voucher.model.respone.AdVoucherRespone;
import com.fshoes.entity.Voucher;
import com.fshoes.repository.VoucherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdVoucherRepository extends VoucherRepository {
    @Query(value = """
            select row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value as maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount as minimumAmount, v.quantity,
            v.start_date as startDate, v.end_date as endDate, v.status
            from voucher v
            where
            (:#{#AVS.nameSearch} is null  or v.code like %:#{#AVS.nameSearch}% or v.name like %:#{#AVS.nameSearch}%)
            and (:#{#AVS.startDateSearch} is null or v.start_date >= :#{#AVS.startDateSearch})
            and (:#{#AVS.endDateSearch} is null or v.end_date <= :#{#AVS.endDateSearch})
            and (:#{#AVS.typeSearch} is null or v.type = :#{#AVS.typeSearch})
            and (:#{#AVS.typeValueSearch} is null or v.type_value = :#{#AVS.typeValueSearch})
            and (:#{#AVS.statusSearch} is null or v.status = :#{#AVS.statusSearch})
            order by v.created_at desc
            """, nativeQuery = true)
    Page<AdVoucherRespone> pageSearchVoucher(Pageable pageable, @Param("AVS") AdVoucherSearch AVS);

    @Query(value = """
            select row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value as maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount as minimumAmount, v.quantity,
            v.start_date as startDate, v.end_date as endDate, v.status
            from voucher v
            """, nativeQuery = true)
    Page<AdVoucherRespone> getPageVoucher(Pageable pageable);

    @Query(value = """
            select row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value as maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount as minimumAmount, v.quantity,
            v.start_date as startDate, v.end_date as endDate, v.status
            from voucher v
            where v.id =:id
            """, nativeQuery = true)
    Optional<AdVoucherRespone> getVoucherById(@Param("id") String id);

    @Query(value = """
            select row_number()  OVER(ORDER BY created_at DESC) as stt,
            id, full_name as fullName, phone_number as phoneNumber, email, date_birth as dateBirth
            from account
            where role = 2
            and status = 0
            and (:#{#textSearch} IS NULL
            OR full_name like %:#{#textSearch}%
            OR phone_number like %:#{#textSearch}%
            OR email like %:#{#textSearch}%)
            order by created_at DESC 
            """, nativeQuery = true)
    Page<AdFindCustomerRespone> getFindAllCustomer(String textSearch, Pageable pageable);

    @Query(value = """
            SELECT DISTINCT code FROM voucher
            """, nativeQuery = true)
    List<String> getAllCodeVoucher();

    @Query(value = """
            SELECT DISTINCT name FROM voucher
            """, nativeQuery = true)
    List<String> getAllNameVoucher();

    @Query(value = """
            SELECT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE
            v.status = 1
            AND v.quantity > 0
            AND (
                (v.type = 0 AND (cv.id_account IS NULL OR :#{#adCallVoucherOfSell.idCustomer} IS NULL))
                OR (
                v.type = 1
                AND cv.id_account = :#{#adCallVoucherOfSell.idCustomer}
                AND :#{#adCallVoucherOfSell.idCustomer} IS NOT NULL
                )
            )
            AND (
                :#{#adCallVoucherOfSell.condition} IS NULL OR v.minimum_amount <= :#{#adCallVoucherOfSell.condition}
            )
            AND
            (
                :#{#adCallVoucherOfSell.textSearch} IS NULL
                OR v.code like %:#{#adCallVoucherOfSell.textSearch}%
                OR v.name like %:#{#adCallVoucherOfSell.textSearch}%
            )
            AND (
                :#{#adCallVoucherOfSell.typeSearch} IS NULL OR v.type = :#{#adCallVoucherOfSell.typeSearch}
            )
            AND (
                :#{#adCallVoucherOfSell.typeValueSearch} IS NULL OR v.type_value = :#{#adCallVoucherOfSell.typeValueSearch}
            )
            AND (
                :#{#adCallVoucherOfSell.idCustomer} IS NULL
                OR NOT EXISTS (
                    SELECT 1
                    FROM bill b
                    WHERE b.id_voucher = v.id
                      AND b.status <> 0
                      AND b.id_customer = :#{#adCallVoucherOfSell.idCustomer}
                )
            )
            GROUP BY v.id
            """, nativeQuery = true)
    Page<AdVoucherRespone> getAllVoucherByIdCustomer(AdCallVoucherOfSell adCallVoucherOfSell, Pageable pageable);

    @Query(value = """
            SELECT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE
            v.status = 1
            AND v.quantity > 0
            AND (
                (v.type = 0 AND (cv.id_account IS NULL OR :#{#adCallVoucherOfSell.idCustomer} IS NULL))
                OR (
                v.type = 1
                AND cv.id_account = :#{#adCallVoucherOfSell.idCustomer}
                AND :#{#adCallVoucherOfSell.idCustomer} IS NOT NULL
                )
            )
            AND (
                :#{#adCallVoucherOfSell.condition} IS NULL OR v.minimum_amount <= :#{#adCallVoucherOfSell.condition}
            )
            AND (
                :#{#adCallVoucherOfSell.idCustomer} IS NULL
                OR NOT EXISTS (
                    SELECT 1
                    FROM bill b
                    WHERE b.id_voucher = v.id
                      AND b.status <> 0
                      AND b.id_customer = :#{#adCallVoucherOfSell.idCustomer}
                )
            )
            GROUP BY v.id
            """, nativeQuery = true)
    List<AdVoucherRespone> getListVoucherByIdCustomer(AdCallVoucherOfSell adCallVoucherOfSell);

    @Query(value = """
            SELECT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE
            v.status = 1
            AND v.quantity > 0
            AND (
                (v.type = 0 AND (cv.id_account IS NULL OR :#{#adCallVoucherOfSell.idCustomer} IS NULL))
                OR (
                v.type = 1
                AND cv.id_account = :#{#adCallVoucherOfSell.idCustomer}
                AND :#{#adCallVoucherOfSell.idCustomer} IS NOT NULL
                )
            )
            AND (
                :#{#adCallVoucherOfSell.condition} IS NULL OR v.minimum_amount > :#{#adCallVoucherOfSell.condition}
            )
            AND (
                :#{#adCallVoucherOfSell.idCustomer} IS NULL
                OR NOT EXISTS (
                    SELECT 1
                    FROM bill b
                    WHERE b.id_voucher = v.id
                      AND b.status <> 0
                      AND b.id_customer = :#{#adCallVoucherOfSell.idCustomer}
                )
            )
            GROUP BY v.id
            """, nativeQuery = true)
    List<AdVoucherRespone> getListVoucherByIdCustomerUnqualified(AdCallVoucherOfSell adCallVoucherOfSell);

    @Query(value = """
            SELECT cv.id, cv.id_account as customer, cv.id_voucher as voucher
            FROM voucher v 
            join customer_voucher cv ON v.id = cv.id_voucher
            WHERE cv.id_account = :#{#idCustomer} AND cv.id_voucher = :#{#idVoucher}
            """, nativeQuery = true)
    AdCustomerVoucherRespone getOneCustomerVoucherByIdVoucherAndIdCustomer(String idVoucher, String idCustomer);

    @Query("""
            select v from Voucher v
            where (v.startDate > :dateNow and v.status != 0)
            or (v.endDate <= :dateNow and v.status != 2)
            or ((v.startDate <= :dateNow and v.endDate > :dateNow) and v.status != 1)
            """)
    List<Voucher> getAllVoucherWrong(Long dateNow);

    @Query(value = """ 
            SELECT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status FROM voucher v
            """, nativeQuery = true)
    List<AdVoucherRespone> getAllVoucher();

    @Query(value = """
             select  ROW_NUMBER() over (ORDER BY created_at desc ) as stt, id, avatar, email,
             full_name as fullName,date_birth as dateBirth,phone_number as phoneNumber,
             gender, created_at as createdAt, status from account WHERE role = 2 AND status = 0
            """, nativeQuery = true)
    List<KhachHangRespone> getAllCustomer();

    @Query(value = """
            select row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value as maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount as minimumAmount, v.quantity,
            v.start_date as startDate, v.end_date as endDate, v.status
            from voucher v
            join bill b on b.id_voucher = v.id
            where b.id = :id
            """, nativeQuery = true)
    Optional<AdVoucherRespone> getVoucherByIdBill(@Param("id") String id);
}
