package com.fshoes.core.admin.thongke.Repository;

import com.fshoes.core.admin.thongke.Modal.Response.*;
import com.fshoes.core.admin.thongke.Modal.request.GetDataDashBoardRequest;
import com.fshoes.repository.BillDetailRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface adminThongKeRepository extends BillDetailRepository {

    @Query(value = """
            SELECT
            CONCAT(p.name, ' - ', c.name, ' - ', m.name, ' - ', s.name, ' - ', ca.name, ' - ', br.name) as nameProduct,
            MAX(pd.price) as price,
            GROUP_CONCAT(DISTINCT i.url) as image,
            GROUP_CONCAT(DISTINCT si.size) as size,
            Sum(bd.quantity) as quantity
            FROM bill_detail bd
            JOIN bill b ON bd.id_bill = b.id
            JOIN product_detail pd ON bd.id_product_detail = pd.id
            JOIN product p ON p.id = pd.id_product
            JOIN color c ON c.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand br ON br.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail
            WHERE
            b.status = 7
            AND bd.status != 1
            AND DATE(FROM_UNIXTIME(b.complete_date / 1000)) = DATE(CURDATE())
            GROUP BY p.id, c.id,m.id,s.id,ca.id,br.id
            ORDER BY quantity DESC;
            """, nativeQuery = true)
    Page<GetDataDashBoardResponse> getProductInDay(GetDataDashBoardRequest request, Pageable pageable);

    @Query(value = """
            SELECT
            CONCAT(p.name, ' - ', c.name, ' - ', m.name, ' - ', s.name, ' - ', ca.name, ' - ', br.name) as nameProduct,
            MAX(pd.price) as price,
            GROUP_CONCAT(DISTINCT i.url) as image,
            GROUP_CONCAT(DISTINCT si.size) as size,
            Sum(bd.quantity) as quantity
            FROM bill_detail bd
            JOIN bill b ON bd.id_bill = b.id
            JOIN product_detail pd ON bd.id_product_detail = pd.id
            JOIN product p ON p.id = pd.id_product
            JOIN color c ON c.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand br ON br.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail
            WHERE
            b.status = 7
            AND bd.status != 1
            AND WEEK(FROM_UNIXTIME(b.complete_date / 1000), 1) = WEEK(CURDATE(), 1)
            GROUP BY p.id, c.id,m.id,s.id,ca.id,br.id
            ORDER BY Sum(bd.quantity) DESC;
            """, nativeQuery = true)
    Page<GetDataDashBoardResponse> getProductInWeek(GetDataDashBoardRequest request, Pageable pageable);

    @Query(value = """
            SELECT
            CONCAT(p.name, ' - ', c.name, ' - ', m.name, ' - ', s.name, ' - ', ca.name, ' - ', br.name) as nameProduct,
            MAX(pd.price) as price,
            GROUP_CONCAT(DISTINCT i.url) as image,
            GROUP_CONCAT(DISTINCT si.size) as size,
            Sum(bd.quantity) as quantity
            FROM bill_detail bd
            JOIN bill b ON bd.id_bill = b.id
            JOIN product_detail pd ON bd.id_product_detail = pd.id
            JOIN product p ON p.id = pd.id_product
            JOIN color c ON c.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand br ON br.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail
            WHERE
            b.status = 7
            AND bd.status != 1
            AND DATE_FORMAT(FROM_UNIXTIME(b.complete_date / 1000), '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
            GROUP BY p.id, c.id,m.id,s.id,ca.id,br.id
            ORDER BY Sum(bd.quantity) DESC;
            """, nativeQuery = true)
    Page<GetDataDashBoardResponse> getProductInMonth(GetDataDashBoardRequest request, Pageable pageable);

    @Query(value = """
            SELECT
            CONCAT(p.name, ' - ', c.name, ' - ', m.name, ' - ', s.name, ' - ', ca.name, ' - ', br.name) as nameProduct,
            MAX(pd.price) as price,
            GROUP_CONCAT(DISTINCT i.url) as image,
            GROUP_CONCAT(DISTINCT si.size) as size,
            Sum(bd.quantity) as quantity
            FROM bill_detail bd
            JOIN bill b ON bd.id_bill = b.id
            JOIN product_detail pd ON bd.id_product_detail = pd.id
            JOIN product p ON p.id = pd.id_product
            JOIN color c ON c.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand br ON br.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail
            WHERE
            b.status = 7
            AND bd.status != 1
            AND DATE_FORMAT(FROM_UNIXTIME(b.complete_date / 1000), '%Y') = DATE_FORMAT(CURDATE(), '%Y')
            GROUP BY p.id, c.id,m.id,s.id,ca.id,br.id
            ORDER BY Sum(bd.quantity) DESC;
            """, nativeQuery = true)
    Page<GetDataDashBoardResponse> getProductInYear(GetDataDashBoardRequest request, Pageable pageable);

    @Query(value = """
            SELECT
            CONCAT(p.name, ' - ', c.name, ' - ', m.name, ' - ', s.name, ' - ', ca.name, ' - ', br.name) as nameProduct,
            MAX(pd.price) as price,
            GROUP_CONCAT(DISTINCT i.url) as image,
            GROUP_CONCAT(DISTINCT si.size) as size,
            Sum(bd.quantity) as quantity
            FROM bill_detail bd
            JOIN bill b ON bd.id_bill = b.id
            JOIN product_detail pd ON bd.id_product_detail = pd.id
            JOIN product p ON p.id = pd.id_product
            JOIN color c ON c.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand br ON br.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail
            WHERE
            b.status = 7
            AND bd.status != 1
            AND (:#{#startDate} IS NULL OR b.complete_date >= :#{#startDate})
            AND (:#{#endDate} IS NULL OR b.complete_date <= :#{#endDate})
            GROUP BY p.id, c.id,m.id,s.id,ca.id,br.id
            ORDER BY Sum(bd.quantity) DESC;
            """, nativeQuery = true)
    Page<GetDataDashBoardResponse> getProductInCustom(Long startDate, Long endDate, Pageable pageable);

    @Query(value = """
            WITH DailySales AS (
                 SELECT
                   DATE(FROM_UNIXTIME(b.updated_at / 1000)) AS sale_date,
                   COUNT(DISTINCT CASE WHEN b.status = 0 THEN b.id END) AS daily_order_cancelled,
                   (
                   SELECT SUM(bi.money_after)
                   FROM bill bi
                   JOIN
                    bill_history bhi on bi.id = bhi.id_bill
                   WHERE
                    bhi.status_bill = 7
                   AND
                    DATE(FROM_UNIXTIME(bi.updated_at / 1000)) = DATE(CURDATE())
                    ) AS daily_total_sales,
                   COUNT(DISTINCT CASE WHEN b.status = 7 THEN b.id END) AS daily_order_count,
                   (
                   SELECT SUM(bdl.quantity)
                   FROM bill bil
                   JOIN
                    bill_detail bdl on bdl.id_bill = bil.id
                   JOIN
                    bill_history bhl on bhl.id_bill = bil.id
                    AND
                    bhl.status_bill = 7
                   AND
                    DATE(FROM_UNIXTIME(bil.updated_at / 1000)) = DATE(CURDATE())
                   ) AS daily_product_sold,
                   COUNT(DISTINCT CASE WHEN b.status = 9 THEN b.id END) AS daily_order_returned
               FROM
                      bill b
                  JOIN
                      bill_detail bd ON b.id = bd.id_bill
                JOIN
                    bill_history bh ON b.id = bh.id_bill
                  WHERE
                      DATE(FROM_UNIXTIME(b.updated_at / 1000)) = DATE(CURDATE())
                  GROUP BY
                      sale_date
              ), WeeklySales AS (
                   SELECT
                   WEEK(FROM_UNIXTIME(b2.updated_at / 1000), 1) AS sale_date,
                   COUNT(DISTINCT CASE WHEN b2.status = 0 THEN b2.id END) AS weekly_order_cancelled,
                 (
                   SELECT SUM(bi2.money_after)
                   FROM bill bi2\s
                   JOIN
                    bill_history bhi2 on bi2.id = bhi2.id_bill
                   WHERE\s
                    bhi2.status_bill = 7
                 AND
                    WEEK(FROM_UNIXTIME(bi2.updated_at / 1000), 1) = WEEK(CURDATE(), 1)
                 ) AS weekly_total_sales,
                   COUNT(DISTINCT CASE WHEN b2.status = 7 THEN b2.id END) AS weekly_order_count,
                 (
                   SELECT SUM(bdl2.quantity)
                   FROM bill bil2
                   JOIN\s
                    bill_detail bdl2 on bdl2.id_bill = bil2.id
                 JOIN
                    bill_history bhl2 on bhl2.id_bill = bil2.id
                 AND\s
                    bhl2.status_bill = 7
                   AND\s
                    WEEK(FROM_UNIXTIME(bil2.updated_at / 1000), 1) = WEEK(CURDATE(), 1)
                   ) AS weekly_product_sold,
                   COUNT(DISTINCT CASE WHEN b2.status = 9 THEN b2.id END) AS weekly_order_returned
                   FROM
                       bill b2
                   JOIN
                       bill_detail bd2 ON b2.id = bd2.id_bill
                 JOIN
                     bill_history bh2 ON b2.id = bh2.id_bill
                   WHERE
                       WEEK(FROM_UNIXTIME(b2.updated_at / 1000), 1) = WEEK(CURDATE(), 1)
                   GROUP BY
                       sale_date
               ), MonthlySales AS (
                  SELECT
                 DATE_FORMAT(FROM_UNIXTIME(b3.updated_at / 1000), '%Y-%m') AS sale_month,
                 COUNT(DISTINCT CASE WHEN b3.status = 0 THEN b3.id END) AS monthly_order_cancelled,
                   (
                   SELECT SUM(bi3.money_after)
                   FROM bill bi3
                   JOIN
                    bill_history bhi3 on bi3.id = bhi3.id_bill
                   WHERE\s
                    bhi3.status_bill = 7\s
                   AND
                    DATE_FORMAT(FROM_UNIXTIME(bi3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
                )
                   AS monthly_total_sales,
                   COUNT(DISTINCT CASE WHEN b3.status = 7 THEN b3.id END) AS monthly_order_count,
                   (
                   SELECT SUM(bdl3.quantity)
                   FROM bill bil3
                   JOIN\s
                    bill_detail bdl3 on bdl3.id_bill = bil3.id
                 JOIN
                    bill_history bhl3 on bhl3.id_bill = bil3.id
                 AND\s
                    bhl3.status_bill = 7
                   AND\s
                    DATE_FORMAT(FROM_UNIXTIME(bil3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
                   ) AS monthly_product_sold,
                   COUNT(DISTINCT CASE WHEN b3.status = 9 THEN b3.id END) AS monthly_order_returned
                  FROM
                      bill b3
                  JOIN
                      bill_detail bd3 ON b3.id = bd3.id_bill
                JOIN
                    bill_history bh3 ON b3.id = bh3.id_bill
                  WHERE
                      DATE_FORMAT(FROM_UNIXTIME(b3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
                  GROUP BY
                      sale_month
              ), YearlySales AS (
                  SELECT
                 DATE_FORMAT(FROM_UNIXTIME(b4.updated_at / 1000), '%Y') AS sale_year,
                 COUNT(DISTINCT CASE WHEN b4.status = 0 THEN b4.id END) AS yearly_order_cancelled,
                 (
                   SELECT SUM(bi4.money_after)
                   FROM bill bi4
                   JOIN
                    bill_history bhi4 on bi4.id = bhi4.id_bill
                   WHERE\s
                    bhi4.status_bill = 7\s
                   AND
                    DATE_FORMAT(FROM_UNIXTIME(bi4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE(), '%Y')
                 ) AS yearly_total_sales,
                   COUNT(DISTINCT CASE WHEN b4.status = 7 THEN b4.id END) AS yearly_order_count,
                  (
                   SELECT SUM(bdl4.quantity)
                   FROM bill bil4
                   JOIN\s
                    bill_detail bdl4 on bdl4.id_bill = bil4.id
                 JOIN
                    bill_history bhl4 on bhl4.id_bill = bil4.id
                 AND\s
                    bhl4.status_bill = 7
                   AND\s
                    DATE_FORMAT(FROM_UNIXTIME(bil4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE(), '%Y')
                   ) AS yearly_product_sold,
                   COUNT(DISTINCT CASE WHEN b4.status = 9 THEN b4.id END) AS yearly_order_returned
                  FROM
                      bill b4
                  JOIN
                      bill_detail bd4 ON b4.id = bd4.id_bill
                JOIN
                    bill_history bh4 ON b4.id = bh4.id_bill
                  WHERE
                      DATE_FORMAT(FROM_UNIXTIME(b4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE(), '%Y')
                  GROUP BY
                      sale_year
              )
              SELECT
                  DATE(CURDATE()) AS 'ngayHienTai',
                  COALESCE(DS.daily_total_sales, 0) AS 'doanhSoNgay',
                  COALESCE(DS.daily_order_count, 0) AS 'soDonHangNgay',
                  COALESCE(DS.daily_product_sold, 0) AS 'soLuongSanPhamNgay',
                  COALESCE(DS.daily_order_cancelled, 0) AS 'soDonHuyNgay',
               COALESCE(DS.daily_order_returned, 0) AS 'soDonTraHangNgay',
                  DATE(CURDATE() - INTERVAL 1 DAY) AS 'tuanNay',
                  COALESCE(WS.weekly_total_sales, 0) AS 'doanhSoTuanNay',
                  COALESCE(WS.weekly_order_count, 0) AS 'soDonHangTuanNay',
                  COALESCE(WS.weekly_product_sold, 0) AS 'soLuongSanPhamTuanNay',
               COALESCE(WS.weekly_order_cancelled, 0) AS 'soDonHuyTuanNay',
               COALESCE(WS.weekly_order_returned, 0) AS 'soDonTraHangTuanNay',
                  DATE_FORMAT(CURDATE(), '%Y-%m') AS 'thangNay',
                  COALESCE(MS.monthly_total_sales, 0) AS 'doanhSoThangNay',
                  COALESCE(MS.monthly_order_count, 0) AS 'soDonHangThangNay',
                  COALESCE(MS.monthly_product_sold, 0) AS 'soLuongSanPhamThangNay',
                  COALESCE(MS.monthly_order_cancelled, 0) AS 'soDonHuyThangNay',
               COALESCE(MS.monthly_order_returned, 0) AS 'soDonTraHangThangNay',
                  DATE_FORMAT(CURDATE(), '%Y') AS 'namNay',
                  COALESCE(YS2.yearly_total_sales, 0) AS 'doanhSoNamNay',
                  COALESCE(YS2.yearly_order_count, 0) AS 'soDonHangNamNay',
                  COALESCE(YS2.yearly_product_sold, 0) AS 'soLuongSanPhamNamNay',
                COALESCE(YS2.yearly_order_cancelled, 0) AS 'soDonHuyNamNay',
                COALESCE(YS2.yearly_order_returned, 0) AS 'soDonTraHangNamNay'
            FROM (SELECT 1) dummy
            LEFT JOIN DailySales DS ON 1 = 1
            LEFT JOIN WeeklySales WS ON 1 = 1
            LEFT JOIN MonthlySales MS ON 1 = 1
            LEFT JOIN YearlySales YS2 ON 1 = 1;
             """, nativeQuery = true)
    List<DoanhThuResponse> getDoanhThu();

    @Query(value = """
                WITH DailySales AS (
                                    SELECT
                                        DATE(FROM_UNIXTIME(b.updated_at / 1000)) = DATE(CURDATE() - INTERVAL 1 DAY) AS sale_date,
                                         (
                                     SELECT SUM(bi.money_after)
                                     FROM bill bi
                                     JOIN
                						bill_history bhi on bi.id = bhi.id_bill
                                     WHERE
                						bhi.status_bill = 7
                                     AND
                						 DATE(FROM_UNIXTIME(bi.updated_at / 1000)) = DATE(CURDATE() - INTERVAL 1 DAY)
                					 ) AS daily_total_sales,
                                        COUNT(DISTINCT b.id) AS daily_order_count,
                                         (
                                     SELECT SUM(bdl.quantity)
                                     FROM bill bil
                                     JOIN
                						bill_detail bdl on bdl.id_bill = bil.id
                					 JOIN
                						bill_history bhl on bhl.id_bill = bil.id
                					 AND
                						bhl.status_bill = 7
                                     AND
                						 DATE(FROM_UNIXTIME(bil.updated_at / 1000)) = DATE(CURDATE() - INTERVAL 1 DAY)
                                     ) AS daily_product_sold
                                    FROM
                                        bill b
                                    JOIN
                                        bill_detail bd ON b.id = bd.id_bill
                					JOIN
                						bill_history bh ON b.id = bh.id_bill
                                    WHERE
                                        DATE(FROM_UNIXTIME(b.updated_at / 1000)) = DATE(CURDATE() - INTERVAL 1 DAY)
                                    GROUP BY
                                        sale_date
                                ), WeeklySales AS (
                                     SELECT
                                         WEEK(FROM_UNIXTIME(b2.updated_at / 1000), 1) = WEEK(CURDATE() - INTERVAL 1 WEEK, 1) AS sale_date,
                                          (
                                     SELECT SUM(bi2.money_after)
                                     FROM bill bi2
                                     JOIN
                						bill_history bhi2 on bi2.id = bhi2.id_bill
                                     WHERE
                						bhi2.status_bill = 7
                                     AND
                					 WEEK(FROM_UNIXTIME(bi2.updated_at / 1000), 1) = WEEK(CURDATE() - INTERVAL 1 WEEK, 1)
                					 ) AS weekly_total_sales,
                                         COUNT(DISTINCT b2.id) AS weekly_order_count,
                                         (
                                     SELECT SUM(bdl2.quantity)
                                     FROM bill bil2
                                     JOIN
                						bill_detail bdl2 on bdl2.id_bill = bil2.id
                					 JOIN
                						bill_history bhl2 on bhl2.id_bill = bil2.id
                					 AND
                						bhl2.status_bill = 7
                                     AND
                						 WEEK(FROM_UNIXTIME(bil2.updated_at / 1000), 1) = WEEK(CURDATE() - INTERVAL 1 WEEK, 1)
                                     ) AS weekly_product_sold
                                     FROM
                                         bill b2
                                     JOIN
                                         bill_detail bd2 ON b2.id = bd2.id_bill
                					JOIN
                						bill_history bh2 ON b2.id = bh2.id_bill
                                     WHERE
                                         WEEK(FROM_UNIXTIME(b2.updated_at / 1000), 1) = WEEK(CURDATE() - INTERVAL 1 WEEK, 1)
                                     GROUP BY
                                         sale_date
                                 ), MonthlySales AS (
                                    SELECT
                                       DATE_FORMAT(FROM_UNIXTIME(b3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m') AS sale_month,
                                         (
                                     SELECT SUM(bi3.money_after)
                                     FROM bill bi3
                                     JOIN
                						bill_history bhi3 on bi3.id = bhi3.id_bill
                                     WHERE
                						bhi3.status_bill = 7
                                     AND
                						 DATE_FORMAT(FROM_UNIXTIME(bi3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
                					 ) AS monthly_total_sales,
                                        COUNT(DISTINCT b3.id) AS monthly_order_count,
                                        (
                                     SELECT SUM(bdl3.quantity)
                                     FROM bill bil3
                                     JOIN
                						bill_detail bdl3 on bdl3.id_bill = bil3.id
                					 JOIN
                						bill_history bhl3 on bhl3.id_bill = bil3.id
                					 AND
                						bhl3.status_bill = 7
                                     AND
                						  DATE_FORMAT(FROM_UNIXTIME(bil3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
                                     ) AS monthly_product_sold
                                    FROM
                                        bill b3
                                    JOIN
                                        bill_detail bd3 ON b3.id = bd3.id_bill
                					JOIN
                						bill_history bh3 ON b3.id = bh3.id_bill
                                    WHERE
                                         DATE_FORMAT(FROM_UNIXTIME(b3.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
                                    GROUP BY
                                        sale_month
                                ), YearlySales AS (
                                    SELECT
                                        DATE_FORMAT(FROM_UNIXTIME(b4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE() - INTERVAL 1 YEAR, '%Y') AS sale_year,
                                         (
                                     SELECT SUM(bi4.money_after)
                                     FROM bill bi4
                                     JOIN
                						bill_history bhi4 on bi4.id = bhi4.id_bill
                                     WHERE
                						bhi4.status_bill = 7
                                     AND
                						 DATE_FORMAT(FROM_UNIXTIME(bi4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE() - INTERVAL 1 YEAR, '%Y')
                					 ) AS yearly_total_sales,
                                        COUNT(DISTINCT b4.id) AS yearly_order_count,
                                        (
                                     SELECT SUM(bdl4.quantity)
                                     FROM bill bil4
                                     JOIN
                						bill_detail bdl4 on bdl4.id_bill = bil4.id
                					 JOIN
                						bill_history bhl4 on bhl4.id_bill = bil4.id
                					 AND
                						bhl4.status_bill = 7
                                     AND
                						 DATE_FORMAT(FROM_UNIXTIME(bil4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE() - INTERVAL 1 YEAR, '%Y')
                                     ) AS yearly_product_sold
                                    FROM
                                        bill b4
                                    JOIN
                                        bill_detail bd4 ON b4.id = bd4.id_bill
                					JOIN
                						bill_history bh4 ON b4.id = bh4.id_bill
                                    WHERE
                                        DATE_FORMAT(FROM_UNIXTIME(b4.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE() - INTERVAL 1 YEAR, '%Y')
                                    GROUP BY
                                        sale_year
                                )
                                SELECT
                                    DATE(CURDATE()) AS 'ngayTruoc',
                                    COALESCE(DS.daily_total_sales, 0) AS 'doanhSoNgayTruoc',
                                    COALESCE(DS.daily_order_count, 0) AS 'soDonNgayTruoc',
                                    COALESCE(DS.daily_product_sold, 0) AS 'soLuongSanPhamNgayTruoc',
                                    DATE(CURDATE() - INTERVAL 1 DAY) AS 'TuanTruoc',
                                    COALESCE(WS.weekly_total_sales, 0) AS 'doanhSoTuanTruoc',
                                    COALESCE(WS.weekly_order_count, 0) AS 'soDonTuanTruoc',
                                    COALESCE(WS.weekly_product_sold, 0) AS 'soLuongSanPhamTuanTruoc',
                                    DATE_FORMAT(CURDATE(), '%Y-%m') AS 'thangTruoc',
                                    COALESCE(MS.monthly_total_sales, 0) AS 'doanhSoThangTruoc',
                                    COALESCE(MS.monthly_order_count, 0) AS 'soDonThangTruoc',
                                    COALESCE(MS.monthly_product_sold, 0) AS 'soLuongSanPhamThangTruoc',
                                    DATE_FORMAT(CURDATE(), '%Y') AS 'namTruoc',
                                    COALESCE(YS2.yearly_total_sales, 0) AS 'doanhSoNamTruoc',
                                    COALESCE(YS2.yearly_order_count, 0) AS 'soDonNamTruoc',
                                    COALESCE(YS2.yearly_product_sold, 0) AS 'soLuongSanPhamNamTruoc'
                                FROM (SELECT 1) dummy
                                LEFT JOIN DailySales DS ON 1 = 1
                                LEFT JOIN WeeklySales WS ON 1 = 1
                                LEFT JOIN MonthlySales MS ON 1 = 1
                                LEFT JOIN YearlySales YS2 ON 1 = 1;
            """, nativeQuery = true)
    List<DoanhThuCuRespone> getDoanhThuCu();

    @Query(value = """
            SELECT
            COUNT(DISTINCT CASE WHEN b.status = 0 THEN b.id END) AS donHuy	,
            SUM(CASE WHEN b.status = 7 THEN b.total_money ELSE 0 END) AS doanhSo,
            COUNT(DISTINCT CASE WHEN b.status = 7 THEN b.id END) AS donHang,
            SUM(CASE WHEN b.status = 7 THEN bd.quantity ELSE 0 END) AS soLuong,
            COUNT(DISTINCT CASE WHEN b.status = 9 THEN b.id END) AS donTra
            FROM bill b
            JOIN bill_detail bd on b.id = bd.id_bill
            WHERE (:#{#startDate} IS NULL OR b.updated_at >= :#{#startDate})
            AND (:#{#endDate} IS NULL OR b.updated_at <= :#{#endDate});
            """,nativeQuery = true)
    List<DoanhThuCustomRespone> getDoanhThuCustom(Long startDate, Long endDate);
    @Query(value = """
            SELECT s.status, COALESCE(COUNT(b.id), 0) AS soLuong
            FROM (
            SELECT 0 AS status UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 9
            ) s
            LEFT JOIN bill b ON s.status = b.status
            WHERE (:#{#startDate} IS NULL OR b.updated_at >= :#{#startDate})
            AND (:#{#endDate} IS NULL OR b.updated_at <= :#{#endDate})
            GROUP BY s.status
            ORDER BY s.status ASC;
            """, nativeQuery = true)
    List<ThongKeSanPhamResponse> getThongKeDonhang(Long startDate, Long endDate);

    @Query(value = """
              SELECT s.status, COALESCE(COUNT(b.id), 0) AS soLuong
              FROM (
                  SELECT 0 AS status UNION ALL
                  SELECT 1 UNION ALL
                  SELECT 2 UNION ALL
                  SELECT 3 UNION ALL
                  SELECT 4 UNION ALL
                  SELECT 5 UNION ALL
                  SELECT 6 UNION ALL
                  SELECT 7 UNION ALL
                  SELECT 9
              ) s
              LEFT JOIN bill b ON s.status = b.status AND DATE(FROM_UNIXTIME(b.updated_at / 1000)) = DATE(CURDATE())
              GROUP BY s.status
              ORDER BY s.status ASC;
            """, nativeQuery = true)
    List<ThongKeSanPhamResponse> getThongKeDonhangTrongNgay();

    @Query(value = """
            SELECT s.status, COALESCE(COUNT(b.id), 0) AS soLuong
            FROM (
            SELECT 0 AS status UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 9
            ) s
            LEFT JOIN bill b ON s.status = b.status AND WEEK(FROM_UNIXTIME(b.updated_at / 1000), 1) = WEEK(CURDATE(), 1)
            GROUP BY s.status
            ORDER BY s.status ASC;
            """, nativeQuery = true)
    List<ThongKeSanPhamResponse> getThongKeDonhangTrongTuan();

    @Query(value = """
            SELECT s.status, COALESCE(COUNT(b.id), 0) AS soLuong
            FROM (
            SELECT 0 AS status UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 9
            ) s
            LEFT JOIN bill b ON s.status = b.status AND DATE_FORMAT(FROM_UNIXTIME(b.updated_at / 1000), '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
            GROUP BY s.status
            ORDER BY s.status ASC;
            """, nativeQuery = true)
    List<ThongKeSanPhamResponse> getThongKeDonhangTrongThang();

    @Query(value = """
            SELECT s.status, COALESCE(COUNT(b.id), 0) AS soLuong
            FROM (
            SELECT 0 AS status UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 9
            ) s
            LEFT JOIN bill b ON s.status = b.status AND DATE_FORMAT(FROM_UNIXTIME(b.updated_at / 1000), '%Y') = DATE_FORMAT(CURDATE(), '%Y')
            GROUP BY s.status
            ORDER BY s.status ASC;
            """, nativeQuery = true)
    List<ThongKeSanPhamResponse> getThongKeDonhangTrongNam();

    @Query(value = """
            SELECT
            CONCAT(p.name, ' - ', c.name, ' - ', m.name, ' - ', s.name, ' - ', ca.name, ' - ', br.name) as nameProduct,
            MAX(pd.price) as price,
            GROUP_CONCAT(DISTINCT i.url) as image,
            GROUP_CONCAT(DISTINCT si.size) as size,
            MAX(pd.amount) as quantity
            FROM product_detail pd\s
            JOIN product p ON p.id = pd.id_product
            JOIN color c ON c.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand br ON br.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail
            WHERE (:#{#request.soLuongSearch} IS NULL OR pd.amount < :#{#request.soLuongSearch})
            GROUP BY p.id, c.id,m.id,s.id,ca.id,br.id
            """, nativeQuery = true)
    Page<GetDataDashBoardResponse> getProductTakeOut(GetDataDashBoardRequest request, Pageable pageable);
}
