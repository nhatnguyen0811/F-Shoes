package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.ClientBillDetailResponse;
import com.fshoes.entity.BillDetail;
import com.fshoes.repository.BillDetailRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientBillDetailRepository extends BillDetailRepository {
    List<BillDetail> findAllByBillId(String billId);

    @Query(value = """
            SELECT bd.id, MIN(i.url) as url,
                    CONCAT(p.name) as productName,
                    bd.price, pd.price as productPrice, s.size as size, bd.quantity, pd.id as productDetailId,
                    bd.status as status , m.name as material , cate.name as category, br.name as brand, sl.name as sole,
                    c.name as color, b.phone_number as phoneNumberCustomer, b.address as address, b.full_name as nameCustomer, b.id as idBill,
                    b.total_money as totalMoney , b.money_after as moneyAfter , b.money_reduced as moneyReduced, b.money_ship as moneyShip, pd.weight as weight
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN product p ON pd.id_product = p.id
                 left join material m on m.id = pd.id_material
              left join category cate on cate.id = pd.id_category
              left join brand br on br.id  = pd.id_brand
              left join sole sl on sl.id = pd.id_sole
              left join size s on s.id = pd.id_size
              left join color c on c.id = pd.id_color
              left join image i on i.id_product_detail = pd.id
                LEFT JOIN bill b ON bd.id_bill = b.id
             WHERE b.id = :idBill 
             GROUP BY bd.id, p.name, c.name, bd.price, pd.price, s.size, pd.id, bd.status;            """, nativeQuery = true)
    List<ClientBillDetailResponse> getBillDetailsByBillId(@Param("idBill") String idBill);

    @Query(value = """
            SELECT bd.id, MIN(i.url) as url,
                    CONCAT(p.name) as productName,
                    bd.price, pd.price as productPrice, s.size as size, bd.quantity, pd.id as productDetailId,
                    bd.status as status , m.name as material , cate.name as category, br.name as brand, sl.name as sole,
                    c.name as color, b.phone_number as phoneNumberCustomer, b.address as address, b.full_name as nameCustomer, b.id as idBill,
                    b.total_money as totalMoney , b.money_after as moneyAfter , b.money_reduced as moneyReduced, b.money_ship as moneyShip, pd.weight as weight
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN product p ON pd.id_product = p.id
                 left join material m on m.id = pd.id_material
              left join category cate on cate.id = pd.id_category
              left join brand br on br.id  = pd.id_brand
              left join sole sl on sl.id = pd.id_sole
              left join size s on s.id = pd.id_size
              left join color c on c.id = pd.id_color
              left join image i on i.id_product_detail = pd.id
                LEFT JOIN bill b ON bd.id_bill = b.id
             WHERE b.id = :idBill
             GROUP BY bd.id, p.name, c.name, bd.price, pd.price, s.size, pd.id, bd.status;            """, nativeQuery = true)
    List<ClientBillDetailResponse> realTimeBillDetailByStatus(@Param("idBill") String idBill);

    @Query(value = """
            SELECT bd.id, MIN(i.url) as url,
                    CONCAT(p.name) as productName,
                    bd.price, pd.price as productPrice, s.size as size, bd.quantity, pd.id as productDetailId,
                    bd.status as status , m.name as material , cate.name as category, br.name as brand, sl.name as sole,
                    c.name as color, b.phone_number as phoneNumberCustomer, b.address as address, b.full_name as nameCustomer, b.id as idBill,
                    b.total_money as totalMoney , b.money_after as moneyAfter , b.money_reduced as moneyReduced, b.money_ship as moneyShip, pd.weight as weight
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN product p ON pd.id_product = p.id
                 left join material m on m.id = pd.id_material
              left join category cate on cate.id = pd.id_category
              left join brand br on br.id  = pd.id_brand
              left join sole sl on sl.id = pd.id_sole
              left join size s on s.id = pd.id_size
              left join color c on c.id = pd.id_color
              left join image i on i.id_product_detail = pd.id
                LEFT JOIN bill b ON bd.id_bill = b.id
             WHERE pd.id = :idPr
             GROUP BY pd.id, bd.id, p.name, c.name, bd.price, pd.price, s.size, pd.id, bd.status;            """, nativeQuery = true)
    ClientBillDetailResponse realTimeProductInBillDetailMyProfile(String idPr);

    @Query(value = """
            SELECT bd.id, MIN(i.url) as url,
                    CONCAT(p.name) as productName,
                    bd.price, pd.price as productPrice, s.size as size, bd.quantity, pd.id as productDetailId,
                    bd.status as status , m.name as material , cate.name as category, br.name as brand, sl.name as sole,
                    c.name as color, b.phone_number as phoneNumberCustomer, b.address as address, b.full_name as nameCustomer, b.id as idBill,
                    b.total_money as totalMoney , b.money_after as moneyAfter , b.money_reduced as moneyReduced, b.money_ship as moneyShip
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN product p ON pd.id_product = p.id
                 left join material m on m.id = pd.id_material
              left join category cate on cate.id = pd.id_category
              left join brand br on br.id  = pd.id_brand
              left join sole sl on sl.id = pd.id_sole
              left join size s on s.id = pd.id_size
              left join color c on c.id = pd.id_color
              left join image i on i.id_product_detail = pd.id
                LEFT JOIN bill b ON bd.id_bill = b.id
             WHERE b.code = :code
             GROUP BY bd.id, p.name, c.name, bd.price, pd.price, s.size, pd.id, bd.status;            """, nativeQuery = true)
    List<ClientBillDetailResponse> getBillDetailsByCode(@Param("code") String code);

    BillDetail getBillDetailByBillIdAndProductDetailId(String idBill, String idProductDetail);


    @Query(value = "SELECT * FROM bill_detail WHERE id_bill = :id", nativeQuery = true)
    List<BillDetail> getBillDetails(String id);
}
