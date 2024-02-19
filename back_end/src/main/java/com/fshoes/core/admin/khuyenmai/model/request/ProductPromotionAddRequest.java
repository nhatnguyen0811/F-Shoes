package com.fshoes.core.admin.khuyenmai.model.request;

import com.fshoes.core.common.PageableRequest;
import com.fshoes.entity.Promotion;
import com.fshoes.util.DateUtil;
import lombok.Getter;
import lombok.Setter;

import java.text.ParseException;
import java.util.Calendar;
import java.util.List;

@Getter
@Setter
public class ProductPromotionAddRequest extends PageableRequest {

    private String name;

    private String timeStart;

    private String timeEnd;

    private Boolean type;

    private Integer value;

    private Integer status;

    private List<String> idProductDetail;

    public Promotion newPromotionAddProduct(Promotion promotion) throws ParseException {

        promotion.setName(this.name);
        promotion.setTimeStart(DateUtil.parseDateTimeLong(this.timeStart));
        promotion.setTimeEnd(DateUtil.parseDateTimeLong(this.timeEnd));
        promotion.setType(this.type);
        promotion.setValue(this.value);
        if(DateUtil.parseDateTimeLong(this.timeStart) <= Calendar.getInstance().getTimeInMillis()){
            promotion.setStatus(1);
        }else {
            promotion.setStatus(0);
        }


        return promotion;


    }

}
