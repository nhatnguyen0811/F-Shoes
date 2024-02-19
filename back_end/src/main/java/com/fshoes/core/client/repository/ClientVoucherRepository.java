package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.request.ClientVoucherRequest;
import com.fshoes.core.client.model.response.ClientVoucherResponse;
import com.fshoes.repository.VoucherRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientVoucherRepository extends VoucherRepository {
    //voucher ban hang
    @Query(value = """
            SELECT DISTINCT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE
            v.status = 1
            AND v.quantity > 0
            AND (:#{#request.condition} IS NULL OR v.minimum_amount <= :#{#request.condition})
            AND 
            ((cv.id_account IS NULL AND v.type = 0)
            OR (cv.id_account = :#{#request.idCustomer} AND v.type = 1)
            )
             AND (
                :#{#request.idCustomer} IS NULL
                OR NOT EXISTS (
                    SELECT 1
                    FROM bill b
                    WHERE b.id_voucher = v.id
                      AND b.status <> 0
                      AND b.id_customer = :#{#request.idCustomer}
                )
            )
            GROUP BY v.id
            """, nativeQuery = true)
    List<ClientVoucherResponse> getAllVoucherByIdCustomer(ClientVoucherRequest request);

    @Query(value = """
            SELECT DISTINCT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            WHERE v.code = :#{#codeVoucher}
            """, nativeQuery = true)
    ClientVoucherResponse getVoucherByCode(String codeVoucher);

    //voucher my profile
    @Query(value = """
            SELECT DISTINCT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE
            v.status = 1
            AND v.quantity > 0
            AND v.type = 0
            AND NOT EXISTS (
                    SELECT 1
                    FROM bill b
                    WHERE b.id_voucher = v.id
                      AND b.status <> 0
                )
            GROUP BY v.id
            """, nativeQuery = true)
    List<ClientVoucherResponse> getVoucherPublicMyProfile();

    @Query(value = """
            SELECT DISTINCT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE
            v.status = 1
            AND v.quantity > 0
            AND v.type = 1
            AND cv.id_account = :#{#idUser}
            AND (
                :#{#idUser} IS NULL
                OR NOT EXISTS (
                    SELECT 1
                    FROM bill b
                    WHERE b.id_voucher = v.id
                      AND b.status <> 0
                      AND b.id_customer = :#{#idUser}
                )
            )
            GROUP BY v.id
            """, nativeQuery = true)
    List<ClientVoucherResponse> getVoucherPrivateMyProfile(String idUser);

    @Query(value = """
            SELECT DISTINCT row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value AS maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount AS minimumAmount, v.quantity,
            v.start_date AS startDate, v.end_date AS endDate, v.status
            FROM voucher v
            LEFT JOIN customer_voucher cv ON v.id = cv.id_voucher
            WHERE v.id = :id
            GROUP BY v.id
            """, nativeQuery = true)
    ClientVoucherResponse getVoucherReal(String id);
}
