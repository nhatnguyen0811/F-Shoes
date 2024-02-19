package com.fshoes.core.client.service;

import com.fshoes.core.client.model.request.ClientFindProductRequest;
import com.fshoes.core.client.model.request.ClientProductCungLoaiRequest;
import com.fshoes.core.client.model.request.ClientProductDetailRequest;
import com.fshoes.core.client.model.request.ClientProductRequest;
import com.fshoes.core.client.model.response.ClientMinMaxPrice;
import com.fshoes.core.client.model.response.ClientProductDetailResponse;
import com.fshoes.core.client.model.response.ClientProductResponse;
import com.fshoes.entity.*;

import java.util.List;

public interface ClientProductService {
    List<ClientProductResponse> getProducts(ClientProductRequest request);

    List<ClientProductResponse> getAllProducts(ClientFindProductRequest request);

    ClientProductResponse getProductById(String id);

    List<ClientProductResponse> getProductsHome(ClientProductRequest request);

    List<ClientProductResponse> getSellingProduct(ClientProductRequest request);
    List<ClientProductResponse> getSaleProduct(ClientProductRequest request);

    List<ClientProductDetailResponse> getProductBySize(ClientProductDetailRequest request);
    List<ClientProductDetailResponse> getProductByColor(ClientProductDetailRequest request);

    List<Brand> getAllBrand();

    List<Category> getAllCategory();

    List<Color> getAllColor();

    List<Material> getAllMaterial();

    List<Size> getAllSize();

    List<Sole> getAllSole();

    List<ClientProductResponse> getProductCungLoai(ClientProductCungLoaiRequest request);

    ClientMinMaxPrice getMinMaxPriceProductClient();
}
