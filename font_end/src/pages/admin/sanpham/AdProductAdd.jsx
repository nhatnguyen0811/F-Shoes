import {
  Autocomplete,
  Button,
  Checkbox,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { RiEditFill } from 'react-icons/ri'
import { MdOutlineRestoreFromTrash } from 'react-icons/md'
import './index.css'
import sanPhamApi from '../../../api/admin/sanpham/sanPhamApi'
import soleApi from '../../../api/admin/sanpham/soleApi'
import categoryApi from '../../../api/admin/sanpham/categoryApi'
import bradApi from '../../../api/admin/sanpham/bradApi'
import materialApi from '../../../api/admin/sanpham/materialApi'
import colorApi from '../../../api/admin/sanpham/colorApi'
import sizeApi from '../../../api/admin/sanpham/sizeApi'

import confirmSatus from '../../../components/comfirmSwal'
import { spButton } from '../sanpham/sanPhamStyle'

import { RiDeleteBin2Line, RiSettings4Fill } from 'react-icons/ri'
import { MdImageSearch } from 'react-icons/md'
import { RiImageAddFill } from 'react-icons/ri'
import AddIcon from '@mui/icons-material/Add'
import DialogAddUpdate from '../../../components/DialogAddUpdate'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../../services/common/formatCurrency '
import { MdOutlineRestore } from 'react-icons/md'
import { SketchPicker } from 'react-color'
import { kytu } from '../../../services/constants/check'

const listBreadcrumbs = [{ name: 'Sản phẩm', link: '/admin/product' }]
const filter = createFilterOptions()
export default function AdProductAdd() {
  const [products, setProducts] = useState([])
  const [productsCheck, setProductsCheck] = useState([])
  const [categorys, setCategorys] = useState([])
  const [brands, setBrands] = useState([])
  const [soles, setSoles] = useState([])
  const [materials, setMaterials] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [modalOpen, setModalOpen] = useState(null)
  const [modalOpenKhoiPhuc, setModalOpenKhoiPhuc] = useState(null)
  const [modalOpenEdit, setModalOpenEdit] = useState(null)

  const [newProducts, setNewProducts] = useState({
    product: { label: '', value: '' },
    description: '',
    sole: null,
    category: null,
    brand: null,
    material: null,
    color: [],
    size: [],
  })

  const [newProductDetails, setNewProductDetails] = useState([])
  const [images, setImages] = useState([])
  const [loadImage, setLoadImage] = useState(false)
  const [openModalColor, setOpenModalColor] = useState(false)
  const [openModalAddColor, setOpenModalAddColor] = useState(false)
  const [openModalUpdateColor, setOpenModalUpdateColor] = useState(false)
  const [openModalSize, setOpenModalSize] = useState(false)
  const [openModalAddSize, setOpenModalAddSize] = useState(false)
  const [openModalUpdateSize, setOpenModalUpdateSize] = useState(false)

  const [newCategory, setNewCategory] = useState({ name: '' })
  const [newBrand, setNewBrand] = useState({ name: '' })
  const [newSole, setNewSole] = useState({ name: '' })
  const [newMaterial, setNewMaterial] = useState({ name: '' })
  const [newColor, setNewColor] = useState({ code: '#000000', name: '' })
  const [newSize, setNewSize] = useState({ size: '' })

  const [colorDetail, setColorDetail] = useState({ id: '', code: '', name: '' })
  const [colorPreview, setColorPreview] = useState({ id: '', code: '', name: '' })
  const [sizeDetail, setSizeDetail] = useState({ id: '', size: '' })
  const [sizePreview, setSizePreview] = useState({ id: '', size: '' })

  const fetchListCategory = () => {
    categoryApi.getList().then(
      (result) => {
        if (result.data.success) {
          setCategorys(result.data.data)
        }
      },
      (err) => console.error(err),
    )
  }
  const fetchListBrand = () => {
    bradApi.getList().then(
      (result) => {
        if (result.data.success) {
          setBrands(result.data.data)
        }
      },
      (err) => console.error(err),
    )
  }
  const fetchListMaterial = () => {
    materialApi.getList().then(
      (result) => {
        if (result.data.success) {
          setMaterials(result.data.data)
        }
      },
      (err) => console.error(err),
    )
  }
  const fetchListSole = () => {
    soleApi.getList().then(
      (result) => {
        if (result.data.success) {
          setSoles(result.data.data)
        }
      },
      (err) => console.error(err),
    )
  }
  const fetchListSize = () => {
    sizeApi.getList().then(
      (result) => {
        if (result.data.success) {
          setSizes(result.data.data)
        }
      },
      (err) => console.error(err),
    )
  }
  const fetchListColor = () => {
    colorApi.getList().then(
      (result) => {
        if (result.data.success) {
          setColors(result.data.data)
        }
      },
      (err) => console.error(err),
    )
  }

  useEffect(() => {
    sanPhamApi.getList().then(
      (result) => {
        if (result.data.success) {
          setProducts(result.data.data)
        }
      },
      (err) => console.error(err),
    )
    fetchListCategory()
    fetchListBrand()
    fetchListSole()
    fetchListMaterial()
    fetchListColor()
    fetchListSize()
  }, [])

  const newProductIsUndefined = (newProducts) => {
    return (
      newProducts.product !== null &&
      newProducts.product.label.trim() !== '' &&
      newProducts.sole !== null &&
      newProducts.category !== null &&
      newProducts.brand !== null &&
      newProducts.material !== null &&
      newProducts.color.length !== 0 &&
      newProducts.size.length !== 0
    )
  }

  const updateNewProductDetail = (productDetail) => {
    removeErrorByKey(productDetail.key)
    setNewProductDetails((prevDetails) => {
      return prevDetails.map((detail) => {
        if (detail.key === productDetail.key) {
          return productDetail
        }
        return detail
      })
    })
  }

  const genNewProductDetail = (newProducts) => {
    setNewProducts(newProducts)
    if (newProductIsUndefined(newProducts)) {
      const preNewProductDetails = []
      newProducts.color.forEach((color) => {
        newProducts.size.forEach((size) => {
          preNewProductDetails.push({
            key: `${newProducts.sole.value}${newProducts.category.value}${newProducts.brand.value}${color.value}${size.value}${newProducts.material.value}`,
            category: newProducts.category,
            brand: newProducts.brand,
            sole: newProducts.sole,
            color: color,
            material: newProducts.material,
            size: size,
            price: 100000,
            amount: 100,
            weight: 500,
            images: [],
          })
        })
      })

      if (newProducts.product.value) {
        sanPhamApi.filter(newProducts.product.value).then((response) => {
          if (response.status === 200) {
            const filerData = response.data ? response.data : []
            setNewProductDetails(
              preNewProductDetails
                .filter((e) => !filerData.includes(e.key))
                .map((productDetail) => {
                  const checkExists = newProductDetails.find((pd) => pd.key === productDetail.key)
                  if (checkExists)
                    return {
                      ...checkExists,
                      product: newProducts.product,
                      description: newProducts.description,
                    }
                  return {
                    ...productDetail,
                    product: newProducts.product,
                    description: newProducts.description,
                  }
                }),
            )
          } else {
            toast.warning('Lỗi hệ thống vui lòng thử lại!')
          }
        })
      } else {
        setNewProductDetails(
          preNewProductDetails.map((productDetail) => {
            const checkExists = newProductDetails.find((pd) => pd.key === productDetail.key)
            if (checkExists)
              return {
                ...checkExists,
                product: newProducts.product,
                description: newProducts.description,
              }
            return {
              ...productDetail,
              product: newProducts.product,
              description: newProducts.description,
            }
          }),
        )
      }
    }
  }

  const [productDelete, setProductDelete] = useState([])
  function deleteNewProduct(productDetail) {
    const preNewProductDetails = [...newProductDetails]
    preNewProductDetails.splice(preNewProductDetails.indexOf(productDetail), 1)
    setNewProductDetails(preNewProductDetails)

    const preProductChecks = [...productsCheck]
    preProductChecks.splice(preProductChecks.indexOf(productDetail), 1)
    setProductsCheck(preProductChecks)

    setProductDelete([...productDelete, productDetail])
  }

  const closeModal = () => {
    setModalOpen(null)
  }
  const closeModalKhoiPhuc = () => {
    setModalOpenKhoiPhuc(null)
  }
  const closeModalEdit = () => {
    setModalOpenEdit(null)
  }

  const ContentModal = ({ images, color }) => {
    const [imageSelect, setImageSelect] = useState(
      newProductDetails.find((productDetail) => productDetail.color.value === color.value).images,
    )

    const handleCheckboxChange = (event, index) => {
      const selectedImage = images[index]
      const preImageSelect = [...imageSelect]

      if (event) {
        if (preImageSelect.length === 3) {
          toast.warning('Chỉ chọn tối đa 3 ảnh')
        } else {
          preImageSelect.push(selectedImage)
          setImageSelect((prevImages) => [...prevImages, selectedImage])
        }
      } else {
        const index = preImageSelect.findIndex((img) => img === selectedImage)
        if (index !== -1) {
          preImageSelect.splice(index, 1)
        }
        setImageSelect([...preImageSelect])
      }
      setNewProductDetails((prevDetails) =>
        prevDetails.map((productDetail) => {
          if (productDetail.color.value === color.value) {
            return { ...productDetail, images: preImageSelect }
          } else {
            return productDetail
          }
        }),
      )
    }
    const deleteCheckboxChange = (image) => {
      const preImageSelect = [...imageSelect]
      const index = preImageSelect.findIndex((img) => img === image)
      if (index !== -1) {
        preImageSelect.splice(index, 1)
      }
      setImageSelect([...preImageSelect])
      setNewProductDetails((prevDetails) =>
        prevDetails.map((productDetail) => {
          if (productDetail.color.value === color.value) {
            return { ...productDetail, images: preImageSelect }
          } else {
            return productDetail
          }
        }),
      )
    }

    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <b>Danh sách ảnh đã chọn</b>
        </Stack>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          {images?.filter((i) => imageSelect?.includes(i))?.length > 0 ? (
            <Grid
              className="hidden-scroll-bar mt-1"
              container
              spacing={1}
              style={{ maxHeight: '400px', overflow: 'auto' }}>
              {images
                .filter((i) => imageSelect?.includes(i))
                .map((image, index) => (
                  <Grid item xs={2} key={`selectImage22${index}`} style={{ position: 'relative' }}>
                    <RiDeleteBin2Line
                      onClick={() => deleteCheckboxChange(image)}
                      fontSize={'20px'}
                      style={{
                        position: 'absolute',
                        top: 15,
                        right: 5,
                        color: 'red',
                        cursor: 'pointer',
                      }}
                    />
                    <img
                      style={{ borderRadius: '5px' }}
                      height={'130px'}
                      width={'100%'}
                      src={image}
                      alt={`anh-${index}`}
                    />
                  </Grid>
                ))}
            </Grid>
          ) : (
            <img
              height={'130px'}
              src={require('../../../assets/image/no-data.png')}
              alt="no-data"
            />
          )}
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <b>Danh sách ảnh màu {color.label}</b>
          <Button
            onClick={() => {
              document.getElementById('them-anh').click()
            }}
            color="cam"
            variant="outlined"
            size="small">
            <RiImageAddFill fontSize={'16px'} />
            Thêm ảnh
          </Button>
          <input
            onChange={(event) => uploadImage(event, color.value)}
            accept="image/*"
            hidden
            multiple
            type="file"
            id="them-anh"
          />
        </Stack>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          {loadImage ? (
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <Skeleton variant="rounded" width={'100%'} height={130} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="rounded" width={'100%'} height={130} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="rounded" width={'100%'} height={130} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="rounded" width={'100%'} height={130} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="rounded" width={'100%'} height={130} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="rounded" width={'100%'} height={130} />
              </Grid>
            </Grid>
          ) : images?.length > 0 ? (
            <Grid
              className="hidden-scroll-bar mt-1"
              container
              spacing={1}
              style={{ maxHeight: '400px', overflow: 'auto' }}>
              {images.map((image, index) => (
                <Grid
                  onClick={() => handleCheckboxChange(!imageSelect?.includes(image), index)}
                  item
                  xs={2}
                  key={`selectImage${index}`}
                  style={{ position: 'relative', cursor: 'pointer' }}>
                  <Checkbox
                    checked={imageSelect?.includes(image)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      color: '#FC7C27',
                      '&.MuiChecked': {
                        color: '#FC7C27',
                      },
                    }}
                  />
                  <img
                    style={{ border: '1px dashed #FC7C27', borderRadius: '5px' }}
                    height={'130px'}
                    width={'100%'}
                    src={image}
                    alt={`anh-${index}`}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <img
              height={'200px'}
              src={require('../../../assets/image/no-data.png')}
              alt="no-data"
            />
          )}
        </div>
      </>
    )
  }

  const ContentModalKhoiPhuc = ({ color }) => {
    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <b>Danh sách sản phẩm màu {color.label} đã xóa</b>
        </Stack>
        {productDelete.filter((productDetail) => productDetail.color.value === color.value).length >
        0 ? (
          <Table sx={{ mt: 1, mb: 1 }} className="tableCss">
            <TableHead>
              <TableRow>
                <TableCell align="center" width={'20%'}>
                  Sản phẩm
                </TableCell>
                <TableCell align="center" width={'10%'}>
                  Kích cỡ
                </TableCell>
                <TableCell align="center" width={'10%'}>
                  Cân nặng
                </TableCell>
                <TableCell align="center" width={'10%'}>
                  Số lượng
                </TableCell>
                <TableCell align="center" width={'10%'}>
                  Giá
                </TableCell>
                <TableCell align="center" width={'4%'}>
                  <MdOutlineRestore
                    onClick={() => {
                      const preNewProductDetails = [...newProductDetails]
                      const arrDelete = productDelete.filter(
                        (productDetail) => productDetail.color.value === color.value,
                      )
                      arrDelete.forEach((productDetail) => {
                        preNewProductDetails.push(productDetail)
                      })
                      setNewProductDetails(preNewProductDetails)
                      setProductDelete([
                        ...productDelete.filter((pd) => !preNewProductDetails.includes(pd)),
                      ])
                    }}
                    style={{ cursor: 'pointer' }}
                    fontSize={'20px'}
                    color="green"
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDelete
                .filter((productDetail) => productDetail.color.value === color.value)
                .map((productDetail) => {
                  return (
                    <>
                      <TableRow key={productDetail.key} style={{ backgroundColor: 'white' }}>
                        <TableCell align="center" sx={{ maxWidth: '0px' }}>
                          {newProducts.product.label}
                        </TableCell>
                        <TableCell align="center">{productDetail.size.label}</TableCell>
                        <TableCell align="center">{productDetail.weight}g</TableCell>
                        <TableCell align="center">{productDetail.amount}</TableCell>
                        <TableCell align="center">{formatCurrency(productDetail.price)}</TableCell>
                        <TableCell align="center">
                          <MdOutlineRestore
                            onClick={() => {
                              const preNewProductDetails = [...newProductDetails]
                              preNewProductDetails.push(productDetail)
                              setNewProductDetails(preNewProductDetails)
                              setProductDelete([
                                ...productDelete.filter((pd) => pd !== productDetail),
                              ])
                            }}
                            style={{ cursor: 'pointer' }}
                            fontSize={'20px'}
                            color="green"
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  )
                })}
            </TableBody>
          </Table>
        ) : (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <img
              height={'200px'}
              src={require('../../../assets/image/no-data.png')}
              alt="no-data"
            />
          </div>
        )}
      </>
    )
  }
  const ContentModalEdit = ({ color }) => {
    const spButton = {
      fontWeight: '600',
      letterSpacing: '1px',
      borderRadius: '10px',
      textTransform: 'none',
    }
    const [data, setData] = useState({ weight: null, amount: null, price: null })

    const [err, setErr] = useState({
      weight: null,
      amount: null,
      price: null,
    })

    function validate(data) {
      let preErr = { ...err }
      let check = true
      if (data.hasOwnProperty('price')) {
        preErr = { ...preErr, price: null }
        if (isNaN(data.price) || data.price <= 0 || data.price >= 100000000) {
          preErr = { ...preErr, price: 'Giá sản phẩm phải là một số dương và nhỏ hơn 100 triệu' }
          check = false
        }
      }

      if (data.hasOwnProperty('amount')) {
        preErr = { ...preErr, amount: null }
        if (
          (data.hasOwnProperty('amount') && isNaN(data.amount)) ||
          data.amount <= 0 ||
          data.amount >= 1000
        ) {
          preErr = { ...preErr, amount: 'Số lượng sản phẩm phải là một số dương và nhỏ hơn 1000' }
          check = false
        }
      }

      if (data.hasOwnProperty('weight')) {
        preErr = { ...preErr, weight: null }
        if (isNaN(data.weight) || data.weight <= 0 || data.weight >= 10000) {
          preErr = {
            ...preErr,
            weight: 'Trọng lượng sản phẩm phải là một số dương và nhỏ hơn 10000',
          }
          check = false
        }
      }

      setErr(preErr)
      return check
    }

    function submit() {
      if (validate(data)) {
        const preNewProducts = [
          ...newProductDetails.map((productDetail) => {
            if (
              productDetail.color.value === color.value &&
              productsCheck.some((product) => {
                return product.key === productDetail.key
              })
            ) {
              return { ...productDetail, ...data }
            }
            return productDetail
          }),
        ]
        setNewProductDetails(preNewProducts)
        setModalOpenEdit(false)
      }
    }

    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <b>Chỉnh sửa nhanh sản phẩm màu {color.label} </b>
        </Stack>
        <Stack className="mt-3 mb-2" direction="column" spacing={1}>
          <div style={{ width: '100%' }}>
            <b>
              <span style={{ color: 'red' }}>*</span>Cân nặng
            </b>
            <TextField
              InputProps={{
                style: { paddingRight: '4px' },
                endAdornment: 'g',
              }}
              size="small"
              color="cam"
              onChange={(e) => {
                validate({ weight: e.target.value })
                setData({ ...data, weight: e.target.value })
              }}
              className="search-field"
              placeholder="Nhập cân nặng"
              variant="outlined"
              fullWidth
              error={Boolean(err.weight)}
              helperText={err.weight}
            />
          </div>
          <div style={{ width: '100%' }}>
            <b>
              <span style={{ color: 'red' }}>*</span>Số lượng
            </b>
            <TextField
              onChange={(e) => {
                validate({ amount: e.target.value })
                setData({ ...data, amount: e.target.value })
              }}
              size="small"
              color="cam"
              className="search-field"
              placeholder="Nhập số lượng"
              variant="outlined"
              fullWidth
              error={Boolean(err.amount)}
              helperText={err.amount}
            />
          </div>
          <div style={{ width: '100%' }}>
            <b>
              <span style={{ color: 'red' }}>*</span>Đơn giá
            </b>
            <TextField
              onChange={(e) => {
                validate({ price: e.target.value })
                setData({ ...data, price: e.target.value })
              }}
              size="small"
              color="cam"
              className="search-field"
              placeholder="Nhập đơn giá"
              variant="outlined"
              fullWidth
              error={Boolean(err.price)}
              helperText={err.price}
            />
          </div>
        </Stack>
        <Stack mt={2} direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
          <Button
            onClick={() => {
              setModalOpenEdit(false)
            }}
            color="error"
            disableElevation
            variant="contained"
            sx={{ ...spButton }}>
            Đóng
          </Button>
          <Button
            onClick={submit}
            color="cam"
            disableElevation
            variant="contained"
            sx={{ ...spButton }}>
            Áp dụng
          </Button>
        </Stack>
      </>
    )
  }

  const uploadImage = (event, nameFolder) => {
    const formData = new FormData()
    for (let index = 0; index < event.target.files.length; index++) {
      formData.append('listImage', event.target.files[index])
    }
    sanPhamApi
      .uploadImage(formData, nameFolder)
      .then((response) => {
        if (response.data.success) {
          const preImage = images
          setImages([
            ...preImage.map((img) => {
              if (img.idColor === nameFolder) {
                return { idColor: nameFolder, data: [...img.data, ...response.data.data] }
              } else {
                return img
              }
            }),
          ])
          toast.success('Tải ảnh lên thành công')
          document.getElementById('them-anh').value = ''
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error('Tải lên ảnh thất bại')
      })
  }

  const navigator = useNavigate()
  const [listErr, setListErr] = useState([])

  function validate() {
    let errors = []

    newProductDetails.forEach((product) => {
      if (isNaN(product.price) || product.price <= 0 || product.price >= 100000000) {
        errors.push({
          key: product.key,
          message: 'Giá sản phẩm phải là một số dương và nhỏ hơn 100 triệu',
        })
        return false
      }
      if (isNaN(product.amount) || product.amount <= 0 || product.amount >= 1000) {
        errors.push({
          key: product.key,
          message: 'Số lượng sản phẩm phải là một số dương và nhỏ hơn 1000',
        })
        return false
      }
      if (isNaN(product.weight) || product.weight <= 0 || product.weight >= 10000) {
        errors.push({
          key: product.key,
          message: 'Trọng lượng sản phẩm phải là một số dương và nhỏ hơn 10000',
        })
        return false
      }
      if (product.images.length < 3) {
        errors = errors.filter((error) => error.key !== product.key)
        errors.push({ key: product.key, message: 'Phải có ít nhất 3 hình ảnh sản phẩm' })
        return false
      }
    })
    setListErr(errors)
    return errors.length === 0
  }

  function removeErrorByKey(key) {
    setListErr((prevErrors) => prevErrors.filter((error) => error.key !== key))
  }

  const [err, setErr] = useState(null)

  function checkProductName(name) {
    const specialCharactersRegex = /[!@#$%^&*(),.?":{}|<>]/
    if (name.trim().length > 0) {
      if (name.trim().length < 100) {
        if (!specialCharactersRegex.test(name)) {
          setErr(null)
          return true
        } else {
          setErr('Tên sản phẩm không được chứa ký tự đặc biệt')
          return false
        }
      } else {
        setErr('Tên sản phẩm nhỏ hơn 100 ký tự')
        return false
      }
    } else {
      setErr('Tên sản phẩm không được để trống')
      return false
    }
  }

  const saveProductDetail = () => {
    try {
      if (checkProductName(newProductDetails[0].product.label)) {
        const title = 'Xác nhận thêm sản phẩm?'
        const text = ''
        if (validate()) {
          confirmSatus(title, text).then((result) => {
            if (result.isConfirmed) {
              const newProductAdd = newProductDetails.map((product) => {
                return {
                  idSole: product.sole.value,
                  idBrand: product.brand.value,
                  idCategory: product.category.value,
                  idMaterial: product.material.value,
                  idSize: product.size.value,
                  idColor: product.color.value,
                  nameProduct: product.product.label,
                  idProduct: product.product.value,
                  price: product.price,
                  amount: product.amount,
                  weight: product.weight,
                  description: product.description,
                  listImage: product.images,
                }
              })
              sanPhamApi
                .addProuct(newProductAdd)
                .then()
                .finally(() => {
                  toast.success('Thêm sản phẩm thành công')
                  navigator('/admin/product')
                })
            }
          })
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Thêm sản phẩm thất bại')
    }
  }

  function openSelectImage(color) {
    if (images.findIndex((image) => image.idColor === color) < 0) {
      setLoadImage(true)
      sanPhamApi
        .getListImage(color)
        .then(
          (response) => {
            if (response.data.success) {
              setImages([
                ...images,
                {
                  idColor: color,
                  data: response.data.data,
                },
              ])
            }
          },
          (error) => {
            console.error(error)
          },
        )
        .finally(() => {
          setLoadImage(false)
        })
    }
  }

  const handleAddCategory = async (newCategory) => {
    try {
      if (newCategory.name.trim() === '') {
        toast.warning('Tên thể loại không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (newCategory.name.trim().length > 100) {
        toast.warning('Tên thể loại nhỏ hơn 100 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const response = await categoryApi.getAllNameCategory()
      if (response.data && Array.isArray(response.data.data)) {
        const listNameCategory = response.data.data
        response.data.data.map((m) => listNameCategory.push(m.toLowerCase()))

        if (listNameCategory.includes(newCategory.name.trim().toLowerCase())) {
          toast.warning('Tên thể loại đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }
        if (kytu.test(newCategory.name.trim())) {
          toast.warning('Tên thể loại không được chứa ký tự đặc biệt', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        await categoryApi.addCategory(newCategory).then((respone) =>
          setNewProducts({
            ...newProducts,
            category: { label: respone.data.data.name, value: respone.data.data.id },
          }),
        )
        toast.success('Thêm thể loại thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListCategory()
      }
    } catch (error) {
      toast.error('Thêm thể loại thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleAddBrand = async (newBrand) => {
    try {
      if (newBrand.name.trim() === '') {
        toast.warning('Tên thương hiệu không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (newBrand.name.trim().length > 100) {
        toast.warning('Tên thương hiệu nhỏ hơn 100 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const response = await bradApi.getAllNameBrand()
      if (response.data && Array.isArray(response.data.data)) {
        const listNameBrand = response.data.data
        response.data.data.map((m) => listNameBrand.push(m.toLowerCase()))

        if (listNameBrand.includes(newBrand.name.trim().toLowerCase())) {
          toast.warning('Tên thương hiệu đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        if (kytu.test(newBrand.name.trim())) {
          toast.warning('Tên thương hiệu không được chứa ký tự đặc biệt', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        await bradApi.addBrand(newBrand).then((respone) =>
          setNewProducts({
            ...newProducts,
            brand: { label: respone.data.data.name, value: respone.data.data.id },
          }),
        )
        toast.success('Thêm thương hiệu thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListBrand()
      }
    } catch (error) {
      toast.error('Thêm thương hiệu thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleAddSole = async (newSole) => {
    try {
      if (newSole.name.trim() === '') {
        toast.warning('Tên đế giày không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (newSole.name.trim().length > 100) {
        toast.warning('Tên đế giày nhỏ hơn 100 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const response = await soleApi.getAllNameSole()
      if (response.data && Array.isArray(response.data.data)) {
        const listNameSole = response.data.data
        response.data.data.map((m) => listNameSole.push(m.toLowerCase()))

        if (listNameSole.includes(newSole.name.trim().toLowerCase())) {
          toast.warning('Tên đế giày đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        if (kytu.test(newSole.name.trim())) {
          toast.warning('Tên đế giày không được chứa ký tự đặc biệt', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        await soleApi.addSole({ ...newSole, name: newSole.name.trim() }).then((respone) =>
          setNewProducts({
            ...newProducts,
            sole: { label: respone.data.data.name, value: respone.data.data.id },
          }),
        )
        toast.success('Thêm đế giày thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListSole()
      }
    } catch (error) {
      toast.error('Thêm đế giày thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleAddMaterial = async (newMaterial) => {
    try {
      if (newMaterial.name.trim() === '') {
        toast.warning('Tên chất liệu không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (newMaterial.name.trim().length > 100) {
        toast.warning('Tên chất liệu nhỏ hơn 100 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (kytu.test(newMaterial.name.trim())) {
        toast.warning('Tên chất liệu không được chứa ký tự đặc biệt', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const response = await materialApi.getAllNameMaterial()
      if (response.data && Array.isArray(response.data.data)) {
        const listNameMaterial = response.data.data
        response.data.data.map((m) => listNameMaterial.push(m.toLowerCase()))

        if (listNameMaterial.includes(newMaterial.name.trim().toLowerCase())) {
          toast.warning('Tên chất liệu đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        await materialApi.addMaterial(newMaterial).then((respone) =>
          setNewProducts({
            ...newProducts,
            material: { label: respone.data.data.name, value: respone.data.data.id },
          }),
        )
        toast.success('Thêm chất liệu thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListMaterial()
      }
    } catch (error) {
      toast.error('Thêm chất liệu thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleAddColor = async (newColor) => {
    try {
      if (newColor.code.trim() === '') {
        toast.warning('Mã màu không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (newColor.name.trim() === '') {
        toast.warning('Tên màu không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (colorDetail.name.trim().length > 100) {
        toast.warning('Tên màu nhỏ hơn 100 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (kytu.test(newColor.name.trim())) {
        toast.warning('Tên màu không được chứa ký tự đặc biệt', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const responseCode = await colorApi.getAllCodeColor()
      const responseName = await colorApi.getAllNameColor()
      if (
        responseCode.data &&
        Array.isArray(responseCode.data.data) &&
        responseName.data &&
        Array.isArray(responseName.data.data)
      ) {
        const listCodeColor = []
        responseCode.data.data.map((m) => listCodeColor.push(m.toLowerCase()))
        const listNameColor = []
        responseName.data.data.map((m) => listNameColor.push(m.toLowerCase()))

        if (listCodeColor.includes(newColor.code.toLowerCase())) {
          toast.warning('Mã màu đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        if (listNameColor.includes(newColor.name.trim().toLowerCase())) {
          toast.warning('Tên màu đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        await colorApi.addColor({ ...newColor, name: newColor.name.trim() })
        toast.success('Thêm màu sắc thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListColor()
      }
      setOpenModalAddColor(false)
      setOpenModalColor(true)
    } catch (error) {
      toast.error('Thêm màu sắc thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
      setOpenModalColor(false)
    }
  }

  const handleUpdateColor = async (colorDetail, colorPreview) => {
    try {
      if (colorDetail.code.trim() === '') {
        toast.warning('Mã màu không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (colorDetail.name.trim() === '') {
        toast.warning('Tên màu không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
      if (colorDetail.name.trim().length > 100) {
        toast.warning('Tên màu nhỏ hơn 100 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const responseCode = await colorApi.getAllCodeColor()
      const responseName = await colorApi.getAllNameColor()
      if (
        responseCode.data &&
        Array.isArray(responseCode.data.data) &&
        responseName.data &&
        Array.isArray(responseName.data.data)
      ) {
        const listCodeColor = []
        responseCode.data.data.map((m) => listCodeColor.push(m.toLowerCase()))
        const listNameColor = []
        responseName.data.data.map((m) => listNameColor.push(m.toLowerCase()))

        if (
          colorPreview.code !== colorDetail.code &&
          listCodeColor.includes(colorDetail.code.toLowerCase())
        ) {
          toast.warning('Mã màu đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        if (
          colorPreview.name !== colorDetail.name &&
          listNameColor.includes(colorDetail.name.trim().toLowerCase())
        ) {
          toast.warning('Tên màu đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }
        if (kytu.test(newColor.name.trim())) {
          toast.warning('Tên màu không được chứa ký tự đặc biệt', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        const dataUpdate = { code: colorDetail.code, name: colorDetail.name.trim() }

        await colorApi.updateColor(colorDetail.id, dataUpdate)
        toast.success('Cập nhật màu sắc thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListColor()
      }
      setOpenModalUpdateColor(false)
      setOpenModalColor(true)
    } catch (error) {
      console.error(error)
      toast.error('Cập nhật màu sắc thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
      setOpenModalColor(false)
    }
  }

  const handleAddSize = async (newSize) => {
    try {
      if (newSize.size.trim() === '') {
        toast.warning('Kích cỡ không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (isNaN(newSize.size) === true) {
        toast.warning('Kích cỡ phải là số', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (parseInt(newSize.size) < 7 || parseInt(newSize.size) > 60) {
        toast.warning('Kích cỡ phải lớn hơn 7 và nhỏ hơn 60', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const response = await sizeApi.getAllNameSize()
      if (response.data && Array.isArray(response.data.data)) {
        const listNameSize = response.data.data

        if (listNameSize.includes(Number(newSize.size))) {
          toast.warning('Kích cỡ đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        await sizeApi.addSize(newSize)
        toast.success('Thêm kích cỡ thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListSize()
      }
      setOpenModalAddSize(false)
      setOpenModalSize(true)
    } catch (error) {
      console.error(error)
      toast.error('Thêm kích cỡ thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleUpdateSize = async (sizeDetail, sizePreview) => {
    try {
      if (sizeDetail.size.trim() === '') {
        toast.warning('Kích cỡ không được trống', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (isNaN(sizeDetail.size) === true) {
        toast.warning('Kích cỡ phải là số', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      if (parseInt(newSize.size) < 10 || parseInt(newSize.size) > 60) {
        toast.warning('Kích cỡ phải lớn hơn 10 và nhỏ hơn 60', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }

      const response = await sizeApi.getAllNameSize()
      if (response.data && Array.isArray(response.data.data)) {
        const listNameSize = response.data.data

        if (
          sizePreview.size !== sizeDetail.size &&
          listNameSize.includes(Number(sizeDetail.size))
        ) {
          toast.warning('Kích cỡ đã tồn tại', {
            position: toast.POSITION.TOP_RIGHT,
          })
          return
        }

        const dataUpdate = { size: sizeDetail.size }

        await sizeApi.updateSize(sizeDetail.id, dataUpdate)
        toast.success('Cập nhật kích cỡ thành công', {
          position: toast.POSITION.TOP_RIGHT,
        })
        fetchListSize()
      }
      setOpenModalUpdateSize(false)
      setOpenModalSize(true)
    } catch (error) {
      toast.error('Cập nhật kích cỡ thất bại', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const [selectColor, setSelectColor] = useState([])
  const handleSelectColor = ({ label, value, code }) => {
    const selectedIndex = selectColor.findIndex((color) => color.value === value)
    let newSelectedIds = []
    if (selectedIndex === -1) {
      newSelectedIds = [...selectColor, { label, value, code }]
    } else {
      newSelectedIds = [
        ...selectColor.slice(0, selectedIndex),
        ...selectColor.slice(selectedIndex + 1),
      ]
    }
    setSelectColor(newSelectedIds)
    genNewProductDetail({ ...newProducts, color: newSelectedIds })
    setProductDelete([...productDelete.filter((product) => product.color.value !== value)])
    setProductsCheck([...productsCheck.filter((product) => product.color.value !== value)])
  }

  const [selectSize, setSelectSize] = useState([])
  const handleSelectSize = ({ label, value }) => {
    const selectedIndex = selectSize.findIndex((s) => s.value === value)
    let newSelectedIds = []

    if (selectedIndex === -1) {
      newSelectedIds = [...selectSize, { label, value }]
    } else {
      newSelectedIds = [
        ...selectSize.slice(0, selectedIndex),
        ...selectSize.slice(selectedIndex + 1),
      ]
    }
    setSelectSize(newSelectedIds)
    genNewProductDetail({ ...newProducts, size: newSelectedIds })
    setProductDelete([...productDelete.filter((product) => product.size.value !== value)])
    setProductsCheck([...productsCheck.filter((product) => product.size.value !== value)])
  }

  const handleOpenUpdateColor = (id, code, name) => {
    setOpenModalColor(false)
    setOpenModalUpdateColor(true)
    setColorDetail({ id: id, code: code, name: name })
    setColorPreview({ id: id, code: code, name: name })
  }

  const handleOpenUpdateSize = (id, size) => {
    setOpenModalSize(false)
    setOpenModalUpdateSize(true)
    setSizeDetail({ id: id, size: size })
    setSizePreview({ id: id, size: size })
  }

  return (
    <div className="san-pham">
      <BreadcrumbsCustom nameHere={'Thêm sản phẩm'} listLink={listBreadcrumbs} />
      <Paper sx={{ py: 2 }}>
        <Container className="container" sx={{ paddingBottom: '10px' }}>
          <Typography
            mb={1}
            textAlign={'center'}
            fontWeight={'600'}
            variant="h6"
            color={'GrayText'}>
            Thông tin sản phẩm
          </Typography>
          <b>
            <span style={{ color: 'red' }}>*</span>Tên sản phẩm
          </b>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              freeSolo
              size="small"
              fullWidth
              onChange={(_, e) => {
                genNewProductDetail({ ...newProducts, product: e })
              }}
              className="search-field"
              id="combo-box-product"
              options={products.map((product) => {
                return { label: product.name, value: product.id }
              })}
              renderInput={(params) => (
                <TextField
                  error={Boolean(err)}
                  helperText={err}
                  onChange={(e) => {
                    checkProductName(e.target.value)
                    const foundProduct = products.find(
                      (product) =>
                        product.name.toLowerCase() === e.target.value.toLowerCase().trim(),
                    )

                    if (foundProduct) {
                      genNewProductDetail({
                        ...newProducts,
                        product: { label: foundProduct.name, value: foundProduct.id },
                      })
                    } else {
                      genNewProductDetail({
                        ...newProducts,
                        product: { label: e.target.value, value: '' },
                      })
                    }
                  }}
                  color="cam"
                  {...params}
                  placeholder="Nhập tên sản phẩm"
                />
              )}
            />
          </Stack>
          <Stack className="mt-3" direction="row" spacing={1}>
            <div style={{ width: '100%' }}>
              <b>
                <span style={{ color: 'red' }}>*</span>Danh mục
              </b>
              <Autocomplete
                size="small"
                fullWidth
                value={newProducts.category}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, e) => {
                  if (e && e.add) {
                    handleAddCategory(newCategory)
                  } else {
                    genNewProductDetail({ ...newProducts, category: e })
                  }
                }}
                className="search-field"
                id="combo-box-category"
                options={categorys.map((category) => {
                  return { label: category.name, value: category.id }
                })}
                renderOption={(props, option, state) => (
                  <div
                    {...props}
                    style={
                      option.label.includes('Thêm mới')
                        ? {
                            color: '#FC7C27',
                            fontWeight: 'bold',
                          }
                        : {}
                    }>
                    {option.label}
                  </div>
                )}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (params.inputValue.trim() !== '') {
                    filtered.push({
                      add: true,
                      label: `Thêm mới "${params.inputValue}"`,
                    })
                  }
                  return filtered
                }}
                renderInput={(params) => (
                  <TextField
                    color="cam"
                    onChange={(e) => setNewCategory({ name: e.target.value })}
                    {...params}
                    placeholder={'Chọn danh mục'}
                  />
                )}
              />
            </div>
            <div style={{ width: '100%' }}>
              <b>
                <span style={{ color: 'red' }}>*</span>Thương hiệu
              </b>
              <Autocomplete
                size="small"
                fullWidth
                className="search-field"
                id="combo-box-brand"
                value={newProducts.brand}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, e) => {
                  if (e && e.add) {
                    handleAddBrand(newBrand)
                  } else {
                    genNewProductDetail({ ...newProducts, brand: e })
                  }
                }}
                options={brands.map((brand) => {
                  return { label: brand.name, value: brand.id }
                })}
                renderOption={(props, option, state) => (
                  <div
                    {...props}
                    style={
                      option.label.includes('Thêm mới')
                        ? {
                            color: '#FC7C27',
                            fontWeight: 'bold',
                          }
                        : {}
                    }>
                    {option.label}
                  </div>
                )}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (params.inputValue.trim() !== '') {
                    filtered.push({
                      add: true,
                      label: `Thêm mới "${params.inputValue}"`,
                    })
                  }
                  return filtered
                }}
                renderInput={(params) => (
                  <TextField
                    color="cam"
                    onChange={(e) => setNewBrand({ name: e.target.value })}
                    {...params}
                    placeholder={'Chọn thương hiệu'}
                  />
                )}
              />
            </div>
          </Stack>
          <Stack className="mt-3" direction="row" spacing={1}>
            <div style={{ width: '100%' }}>
              <b>
                <span style={{ color: 'red' }}>*</span>Đế giày
              </b>
              <Autocomplete
                size="small"
                fullWidth
                value={newProducts.sole}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, e) => {
                  if (e && e.add) {
                    handleAddSole(newSole)
                  } else {
                    genNewProductDetail({ ...newProducts, sole: e })
                  }
                }}
                className="search-field"
                id="combo-box-sole"
                options={soles.map((sole) => {
                  return { label: sole.name, value: sole.id }
                })}
                renderOption={(props, option, state) => (
                  <div
                    {...props}
                    style={
                      option.label.includes('Thêm mới')
                        ? {
                            color: '#FC7C27',
                            fontWeight: 'bold',
                          }
                        : {}
                    }>
                    {option.label}
                  </div>
                )}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (params.inputValue.trim() !== '') {
                    filtered.push({
                      add: true,
                      label: `Thêm mới "${params.inputValue}"`,
                    })
                  }
                  return filtered
                }}
                renderInput={(params) => (
                  <TextField
                    color="cam"
                    onChange={(e) => setNewSole({ name: e.target.value })}
                    {...params}
                    placeholder={'Chọn đế giày'}
                  />
                )}
              />
            </div>
            <div style={{ width: '100%' }}>
              <b>
                <span style={{ color: 'red' }}>*</span>Chất liệu
              </b>
              <Autocomplete
                size="small"
                fullWidth
                className="search-field"
                id="combo-box-material"
                value={newProducts.material}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, e) => {
                  if (e && e.add) {
                    handleAddMaterial(newMaterial)
                  } else {
                    genNewProductDetail({ ...newProducts, material: e })
                  }
                }}
                options={materials.map((material) => {
                  return { label: material.name, value: material.id }
                })}
                renderOption={(props, option, state) => (
                  <div
                    {...props}
                    style={
                      option.label.includes('Thêm mới')
                        ? {
                            color: '#FC7C27',
                            fontWeight: 'bold',
                          }
                        : {}
                    }>
                    {option.label}
                  </div>
                )}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (params.inputValue.trim() !== '') {
                    filtered.push({
                      add: true,
                      label: `Thêm mới "${params.inputValue}"`,
                    })
                  }
                  return filtered
                }}
                renderInput={(params) => (
                  <TextField
                    color="cam"
                    onChange={(e) => setNewMaterial({ name: e.target.value })}
                    {...params}
                    placeholder={'Chọn chất liệu'}
                  />
                )}
              />
            </div>
          </Stack>
          <div className="mt-3 mb-3">
            <b>Mô tả sản phẩm</b>
            <Stack spacing={1}>
              <TextField
                color="cam"
                onChange={(e) => {
                  genNewProductDetail({ ...newProducts, description: e.target.value })
                }}
                className="search-field"
                placeholder="Nhập mô tả sản phẩm"
                multiline
                rows={2}
                variant="outlined"
                fullWidth
              />
            </Stack>
          </div>
        </Container>
      </Paper>
      <Paper sx={{ py: 2, mt: 2 }}>
        <Container className="container" sx={{ paddingBottom: '10px' }}>
          <Typography
            mb={1}
            textAlign={'center'}
            fontWeight={'600'}
            variant="h6"
            color={'GrayText'}>
            Màu sắc & kích cỡ
          </Typography>
          <div className="div-color-size">
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <b>
                  <span style={{ color: 'red' }}>*</span>Màu sắc :
                </b>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  {selectColor.map((s) => (
                    <Grid item xs={2}>
                      <div style={{ position: 'relative' }}>
                        <Button
                          disabled
                          sx={{
                            width: '20px',
                            height: '30px',
                            backgroundColor: `${s.code}`,
                            border:
                              s.code === '#ffffff' ? `1px solid #000000` : `1px solid ${s.code}`,
                          }}></Button>
                        <span
                          onClick={() => {
                            handleSelectColor(s)
                          }}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '5px',
                            top: '-6px',
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            textAlign: 'center',
                            lineHeight: '20px',
                          }}>
                          x
                        </span>
                      </div>
                    </Grid>
                  ))}
                  <Grid item xs={2}>
                    <Button className="button-color-size" onClick={() => setOpenModalColor(true)}>
                      <AddIcon className="add-icon-color-size" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {openModalColor && (
                <DialogAddUpdate
                  open={openModalColor}
                  setOpen={setOpenModalColor}
                  title={'Chọn màu sắc'}
                  buttonSubmit={
                    <Button
                      onClick={() => {
                        setOpenModalColor(false)
                        setOpenModalAddColor(true)
                      }}
                      color="primary"
                      disableElevation
                      sx={{ ...spButton }}
                      variant="contained">
                      Thêm mới
                    </Button>
                  }>
                  <Grid container spacing={2}>
                    {colors.map((c) => (
                      <Grid item xs={3}>
                        <div style={{ position: 'relative' }}>
                          <Button
                            fullWidth
                            sx={{
                              backgroundColor:
                                selectColor.findIndex(
                                  (selectedColor) => selectedColor.value === c.id,
                                ) !== -1
                                  ? 'white'
                                  : c.code,
                              border:
                                c.code === '#ffffff' ? `1px solid #000000` : `1px solid ${c.code}`,
                              height: '30px',
                            }}
                            onClick={() =>
                              handleSelectColor({ label: c.name, value: c.id, code: c.code })
                            }>
                            <span
                              style={{
                                fontSize: '10px',
                                color:
                                  selectColor.findIndex(
                                    (selectedColor) => selectedColor.value === c.id,
                                  ) !== -1
                                    ? 'black'
                                    : c.code === '#ffffff'
                                      ? 'black'
                                      : 'white',
                              }}>
                              {c.code}
                            </span>
                          </Button>
                          <span
                            onClick={() => handleOpenUpdateColor(c.id, c.code, c.name)}
                            style={{
                              position: 'absolute',
                              right: '-5px',
                              top: '-10px',
                              backgroundColor: 'red',
                              color: 'white',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              textAlign: 'center',
                            }}>
                            <RiSettings4Fill />
                          </span>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </DialogAddUpdate>
              )}
              {openModalAddColor && (
                <DialogAddUpdate
                  closeButton={true}
                  open={openModalAddColor}
                  setOpen={setOpenModalAddColor}
                  title={'Thêm mới màu sắc'}>
                  <Stack
                    mt={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={2}>
                    <SketchPicker
                      presetColors={[]}
                      disableAlpha
                      color={newColor.code}
                      onChange={(e) => {
                        setNewColor({ ...newColor, code: e.hex })
                      }}
                    />
                    <div>
                      <Grid container spacing={2} mb={2}>
                        <Grid item xs={4.5}>
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: newColor.code,
                              borderRadius: '50%',
                            }}></div>
                        </Grid>
                        <Grid item xs={7.5} sx={{ display: 'flex', alignItems: 'center' }}>
                          {newColor.code}
                        </Grid>
                      </Grid>
                      <div>
                        <TextField
                          sx={{ mb: 2 }}
                          id={'nameInputAdd'}
                          onChange={(e) => {
                            setNewColor({ ...newColor, name: e.target.value })
                          }}
                          defaultValue={''}
                          fullWidth
                          inputProps={{
                            required: true,
                          }}
                          size="small"
                          placeholder="Nhập tên màu"
                        />
                      </div>
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Button
                          onClick={() => {
                            setOpenModalAddColor(false)
                          }}
                          color="error"
                          disableElevation
                          variant="contained"
                          sx={{ ...spButton }}>
                          Đóng
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                          onClick={() => {
                            handleAddColor(newColor)
                          }}
                          color="primary"
                          disableElevation
                          sx={{ ...spButton }}
                          variant="contained">
                          Thêm
                        </Button>
                      </Stack>
                    </div>
                  </Stack>
                </DialogAddUpdate>
              )}
              {openModalUpdateColor && (
                <DialogAddUpdate
                  closeButton={true}
                  open={openModalUpdateColor}
                  setOpen={setOpenModalUpdateColor}
                  title={'Cập nhật màu sắc'}>
                  <Stack
                    mt={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={2}>
                    <SketchPicker
                      presetColors={[]}
                      disableAlpha
                      color={colorDetail.code}
                      onChange={(e) => setColorDetail({ ...colorDetail, code: e.hex })}
                    />
                    <div>
                      <Grid container spacing={2} mb={2}>
                        <Grid item xs={4.5}>
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: colorDetail.code,
                              borderRadius: '50%',
                            }}></div>
                        </Grid>
                        <Grid item xs={7.5} sx={{ display: 'flex', alignItems: 'center' }}>
                          {colorDetail.code}
                        </Grid>
                      </Grid>
                      <div>
                        <TextField
                          sx={{ mb: 2 }}
                          id={'nameInputAdd'}
                          onChange={(e) => {
                            setColorDetail({ ...colorDetail, name: e.target.value })
                          }}
                          defaultValue={colorDetail.name}
                          fullWidth
                          inputProps={{
                            required: true,
                          }}
                          size="small"
                          placeholder="Nhập tên màu"
                        />
                      </div>
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Button
                          onClick={() => {
                            setOpenModalUpdateColor(false)
                          }}
                          color="error"
                          disableElevation
                          variant="contained"
                          sx={{ ...spButton, marginLeft: 0 }}>
                          Đóng
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                          onClick={() => {
                            handleUpdateColor(colorDetail, colorPreview)
                          }}
                          color="primary"
                          disableElevation
                          sx={{ ...spButton, marginLeft: 0 }}
                          variant="contained">
                          Cập nhật
                        </Button>
                      </Stack>
                    </div>
                  </Stack>
                </DialogAddUpdate>
              )}
            </Grid>
          </div>
          <div className="div-color-size">
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <b>
                  <span style={{ color: 'red' }}>*</span>Kích cỡ :
                </b>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  {selectSize.map((s) => (
                    <Grid item xs={2}>
                      <div style={{ position: 'relative' }}>
                        <Button
                          disabled
                          sx={{
                            width: '20px',
                            height: '30px',
                            backgroundColor: `white`,
                            border: `1px solid black`,
                          }}>
                          <span style={{ color: 'black' }}>{s.label}</span>
                        </Button>
                        <span
                          onClick={() => {
                            handleSelectSize(s)
                          }}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '5px',
                            top: '-6px',
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            textAlign: 'center',
                            lineHeight: '20px',
                          }}>
                          x
                        </span>
                      </div>
                    </Grid>
                  ))}
                  <Grid item xs={2}>
                    <Button className="button-color-size" onClick={() => setOpenModalSize(true)}>
                      <AddIcon className="add-icon-color-size" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {openModalSize && (
                <DialogAddUpdate
                  open={openModalSize}
                  setOpen={setOpenModalSize}
                  title={'Chọn kích cỡ'}
                  buttonSubmit={
                    <Button
                      onClick={() => {
                        setOpenModalSize(false)
                        setOpenModalAddSize(true)
                      }}
                      color="primary"
                      disableElevation
                      sx={{ ...spButton }}
                      variant="contained">
                      Thêm mới
                    </Button>
                  }>
                  <Grid container spacing={2}>
                    {sizes.map((s) => (
                      <Grid item xs={3}>
                        <div style={{ position: 'relative' }}>
                          <Button
                            fullWidth
                            sx={{
                              backgroundColor:
                                selectSize.findIndex((select) => select.value === s.id) !== -1
                                  ? 'gray'
                                  : `white`,
                              border: `1px solid #000000`,
                              height: '30px',
                            }}
                            onClick={() => handleSelectSize({ label: s.size, value: s.id })}>
                            <span
                              style={{
                                fontSize: '10px',
                                color: 'black',
                              }}>
                              {s.size}
                            </span>
                          </Button>
                          <span
                            onClick={() => handleOpenUpdateSize(s.id, s.size)}
                            style={{
                              cursor: 'pointer',
                              position: 'absolute',
                              right: '-5px',
                              top: '-10px',
                              backgroundColor: 'red',
                              color: 'white',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              textAlign: 'center',
                            }}>
                            <RiSettings4Fill />
                          </span>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </DialogAddUpdate>
              )}
              {openModalAddSize && (
                <DialogAddUpdate
                  open={openModalAddSize}
                  setOpen={setOpenModalAddSize}
                  title={'Thêm mới kích cỡ'}
                  buttonSubmit={
                    <Button
                      onClick={() => {
                        handleAddSize(newSize)
                      }}
                      color="primary"
                      disableElevation
                      sx={{ ...spButton }}
                      variant="contained">
                      Thêm
                    </Button>
                  }>
                  <TextField
                    id={'nameInputAdd'}
                    onChange={(e) => {
                      setNewSize({ size: e.target.value })
                    }}
                    defaultValue={''}
                    fullWidth
                    inputProps={{
                      required: true,
                    }}
                    size="small"
                    placeholder="Nhập kích cỡ"
                  />
                </DialogAddUpdate>
              )}

              {openModalUpdateSize && (
                <DialogAddUpdate
                  open={openModalUpdateSize}
                  setOpen={setOpenModalUpdateSize}
                  title={'Thêm mới kích cỡ'}
                  buttonSubmit={
                    <Button
                      onClick={() => {
                        handleUpdateSize(sizeDetail, sizePreview)
                      }}
                      color="primary"
                      disableElevation
                      sx={{ ...spButton }}
                      variant="contained">
                      Cập nhật
                    </Button>
                  }>
                  <TextField
                    id={'nameInputAdd'}
                    onChange={(e) => {
                      setSizeDetail({ ...sizeDetail, size: e.target.value })
                    }}
                    defaultValue={sizeDetail.size}
                    fullWidth
                    inputProps={{
                      required: true,
                    }}
                    size="small"
                    placeholder="Nhập kích cỡ"
                  />
                </DialogAddUpdate>
              )}
            </Grid>
          </div>
          <Stack className="mt-3 mb-3" spacing={1}></Stack>
        </Container>
      </Paper>
      {newProductIsUndefined(newProducts) &&
        newProducts.color.map((color, colorIndex) => {
          return (
            <Paper key={`papaerNewProduct${colorIndex}`} sx={{ py: 2, mt: 2 }}>
              <Container>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    textAlign={'center'}
                    fontWeight={'600'}
                    variant="h7"
                    color={'GrayText'}>
                    Danh sách sản phẩm màu {color.label}
                  </Typography>
                  <div>
                    {productsCheck.filter(
                      (productDetail) => productDetail.color.value === color.value,
                    ).length > 0 && (
                      <Button
                        onClick={() => {
                          setModalOpenEdit(`papaerNewProduct${colorIndex}`)
                        }}
                        size="small"
                        color="cam"
                        variant="contained">
                        <RiEditFill />
                        Chỉnh sửa
                      </Button>
                    )}
                    &nbsp; &nbsp;
                    <Button
                      onClick={() => {
                        setModalOpenKhoiPhuc(`papaerNewProduct${colorIndex}`)
                      }}
                      size="small"
                      color="cam"
                      variant="outlined">
                      <MdOutlineRestoreFromTrash />
                      Khôi phục
                    </Button>
                  </div>
                </Stack>
                {newProductDetails.filter(
                  (productDetail) => productDetail.color.value === color.value,
                ).length > 0 ? (
                  <Table sx={{ mt: 1, mb: 1 }} className="tableCss">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" width={'1%'}>
                          <Checkbox
                            color="cam"
                            checked={
                              newProductDetails.filter(
                                (productDetail) => productDetail.color.value === color.value,
                              ).length ===
                              productsCheck.filter(
                                (productDetail) => productDetail.color.value === color.value,
                              ).length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductsCheck([
                                  ...productsCheck.filter(
                                    (pd) =>
                                      !newProductDetails
                                        .filter(
                                          (productDetail) =>
                                            productDetail.color.value === color.value,
                                        )
                                        .some((product) => {
                                          return product.key === pd.key
                                        }),
                                  ),
                                  ...newProductDetails.filter(
                                    (productDetail) => productDetail.color.value === color.value,
                                  ),
                                ])
                              } else {
                                setProductsCheck([
                                  ...productsCheck.filter(
                                    (pd) =>
                                      !newProductDetails
                                        .filter(
                                          (productDetail) =>
                                            productDetail.color.value === color.value,
                                        )
                                        .some((product) => {
                                          return product.key === pd.key
                                        }),
                                  ),
                                ])
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" width={'20%'}>
                          Sản phẩm
                        </TableCell>
                        <TableCell align="center" width={'10%'}>
                          Kích cỡ
                        </TableCell>
                        <TableCell align="center" width={'10%'}>
                          Cân nặng
                        </TableCell>
                        <TableCell align="center" width={'10%'}>
                          Số lượng
                        </TableCell>
                        <TableCell align="center" width={'10%'}>
                          Giá
                        </TableCell>
                        <TableCell align="center" width={'4%'}>
                          <RiDeleteBin2Line
                            onClick={() => {
                              const preDelete = newProductDetails.filter(
                                (productDetail) => productDetail.color.value === color.value,
                              )
                              setListErr((prevErrors) =>
                                prevErrors.filter(
                                  (error) => !preDelete.map((del) => del.key).includes(error.key),
                                ),
                              )
                              setNewProductDetails([
                                ...newProductDetails.filter(
                                  (pd) => !preDelete.map((del) => del.key).includes(pd.key),
                                ),
                              ])
                              setProductsCheck([
                                ...productsCheck.filter(
                                  (pd) => !preDelete.map((del) => del.key).includes(pd.key),
                                ),
                              ])

                              setProductDelete([...productDelete, ...preDelete])
                            }}
                            style={{ cursor: 'pointer' }}
                            fontSize={'20px'}
                            color="#da0722"
                          />
                        </TableCell>
                        <TableCell align="center" width={'40%'}>
                          Ảnh
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newProductDetails
                        .filter((productDetail) => productDetail.color.value === color.value)
                        .map((productDetail, index) => {
                          return (
                            <>
                              <TableRow
                                key={productDetail.key}
                                style={{ backgroundColor: 'white' }}>
                                <TableCell align="center">
                                  <Checkbox
                                    color="cam"
                                    checked={productsCheck.some((product) => {
                                      return product.key === productDetail.key
                                    })}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setProductsCheck([...productsCheck, productDetail])
                                      } else {
                                        setProductsCheck([
                                          ...productsCheck.filter(
                                            (pd) => pd.key !== productDetail.key,
                                          ),
                                        ])
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ maxWidth: '0px' }}>
                                  {newProducts.product.label}
                                </TableCell>
                                <TableCell align="center">{productDetail.size.label}</TableCell>
                                <TableCell align="center">
                                  <TextField
                                    value={productDetail.weight}
                                    onChange={(e) => {
                                      updateNewProductDetail({
                                        ...productDetail,
                                        weight: e.target.value,
                                      })
                                    }}
                                    InputProps={{
                                      style: { paddingRight: '4px' },
                                      endAdornment: 'g',
                                    }}
                                    inputProps={{ min: 1 }}
                                    size="small"
                                    sx={{
                                      '& input': {
                                        p: 0,
                                        textAlign: 'center',
                                        fontSize: '14px',
                                      },
                                      '& fieldset': {
                                        fontSize: '14px',
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    value={productDetail.amount}
                                    onChange={(e) => {
                                      updateNewProductDetail({
                                        ...productDetail,
                                        amount: e.target.value.replace(/\D/g, ''),
                                      })
                                    }}
                                    inputProps={{ min: 1 }}
                                    size="small"
                                    sx={{
                                      '& input': {
                                        p: 0,
                                        textAlign: 'center',
                                        fontSize: '14px',
                                      },
                                      '& fieldset': {
                                        fontSize: '14px',
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    value={formatCurrency(productDetail.price)}
                                    inputProps={{ min: 1 }}
                                    size="small"
                                    onChange={(e) => {
                                      updateNewProductDetail({
                                        ...productDetail,
                                        price: e.target.value.replace(/\D/g, ''),
                                      })
                                    }}
                                    sx={{
                                      '& input': {
                                        p: 0,
                                        textAlign: 'center',
                                        fontSize: '14px',
                                      },
                                      '& fieldset': {
                                        fontSize: '14px',
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <RiDeleteBin2Line
                                    onClick={() => {
                                      removeErrorByKey(productDetail.key)
                                      deleteNewProduct(productDetail)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    fontSize={'20px'}
                                    color="#da0722"
                                  />
                                </TableCell>
                                {index === 0 && (
                                  <TableCell align="center" rowSpan={newProductDetails.length * 2}>
                                    <Stack
                                      direction="row"
                                      justifyContent="center"
                                      alignItems="center"
                                      spacing={1}>
                                      {newProductDetails
                                        .find(
                                          (productDetail) =>
                                            productDetail.color.value === color.value,
                                        )
                                        .images.map((image, index) => {
                                          return (
                                            <img
                                              key={`showImage${colorIndex}`}
                                              width={'100px'}
                                              height={'100px'}
                                              style={{
                                                border: '1px dashed #ccc',
                                              }}
                                              src={image}
                                              alt="anh-san-pham"
                                            />
                                          )
                                        })}
                                      <Tooltip title="Chỉnh sửa ảnh">
                                        <div
                                          onClick={() => {
                                            openSelectImage(color.value)
                                            setModalOpen(`papaerNewProduct${colorIndex}`)
                                          }}
                                          style={{
                                            cursor: 'pointer',
                                            border: '1px dashed #ccc',
                                            width: '100px',
                                            height: '100px',
                                            textAlign: 'center',
                                            lineHeight: '100px',
                                          }}>
                                          <MdImageSearch
                                            fontSize={'20px'}
                                            style={{ marginBottom: '-3px', marginRight: '5px' }}
                                          />
                                          Ảnh
                                        </div>
                                      </Tooltip>
                                    </Stack>
                                  </TableCell>
                                )}
                              </TableRow>
                              {listErr.find((err) => err.key === productDetail.key) && (
                                <TableRow style={{ backgroundColor: 'white' }}>
                                  <TableCell colSpan={7}>
                                    <span style={{ color: 'red' }}>
                                      {listErr.find((err) => err.key === productDetail.key).message}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })}
                    </TableBody>
                  </Table>
                ) : (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <img
                      height={'200px'}
                      src={require('../../../assets/image/no-data.png')}
                      alt="no-data"
                    />
                  </div>
                )}
              </Container>

              <DialogAddUpdate
                width={'md'}
                open={modalOpen === `papaerNewProduct${colorIndex}`}
                setOpen={closeModal}>
                <ContentModal
                  color={color}
                  images={images.find((image) => image.idColor === color.value)?.data}
                />
              </DialogAddUpdate>
              <DialogAddUpdate
                closeButton={true}
                width={'md'}
                open={modalOpenKhoiPhuc === `papaerNewProduct${colorIndex}`}
                setOpen={closeModalKhoiPhuc}>
                <ContentModalKhoiPhuc color={color} />
              </DialogAddUpdate>
              <DialogAddUpdate
                closeButton={true}
                width={'xs'}
                open={modalOpenEdit === `papaerNewProduct${colorIndex}`}
                setOpen={closeModalEdit}>
                <ContentModalEdit color={color} />
              </DialogAddUpdate>
            </Paper>
          )
        })}
      {newProductDetails.length > 0 && (
        <Button
          onClick={() => {
            saveProductDetail()
          }}
          color="cam"
          variant="contained"
          sx={{ mt: 2, float: 'right' }}>
          Lưu thay đổi
        </Button>
      )}
    </div>
  )
}
