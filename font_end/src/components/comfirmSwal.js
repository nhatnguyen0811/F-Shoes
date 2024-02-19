import Swal from 'sweetalert2'

export default function confirmSatus(title, text) {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F2721E',
    cancelButtonColor: '#FF3333',
    confirmButtonText: 'Vâng!',
    cancelButtonText: 'Hủy',
  })
}
