import * as React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

export default function BreadcrumbsCustom({ listLink, nameHere }) {
  let breadcrumbs = []

  if (Array.isArray(listLink)) {
    breadcrumbs = [
      listLink.map((e, index) => {
        return (
          <Typography
            variant="h4"
            sx={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '600 !important',
              fontSize: 'calc(0.9rem + 0.15vw) !important',
            }}
            component={e.link != null ? Link : ''}
            key={`listLink${index + 1}`}
            to={e.link}>
            {e.name}
          </Typography>
        )
      }),
    ]
  }
  breadcrumbs.push(
    <Typography
      sx={{
        textDecoration: 'none',
        fontWeight: '500 !important',
        fontSize: 'calc(0.9rem + 0.15vw) !important',
      }}
      key={'listLink0'}>
      {nameHere}
    </Typography>,
  )
  return (
    <Breadcrumbs
      separator={
        <Typography
          sx={{
            fontSize: 'calc(0.9rem + 0.15vw) !important',
          }}>
          {nameHere && '/'}
        </Typography>
      }
      sx={{ mb: 1 }}
      aria-label="breadcrumb">
      {breadcrumbs}
    </Breadcrumbs>
  )
}
