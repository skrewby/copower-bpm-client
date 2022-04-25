import PropTypes from 'prop-types';
import { Fragment } from 'react';
import numeral from 'numeral';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { PropertyList } from '../property-list';
import { Add, Delete, Store, LocationCity, Discount, CreditCard } from '@mui/icons-material';

import { InputField } from '../form/input-field';
import { DateField } from '../form/date-field';

import { useMounted } from '../../hooks/use-mounted';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material';

export const LeadSystemSummary = (props) => {
    const { lead, ...other } = props;
    const mounted = useMounted();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          items: [
            {
              description: '',
              price: '',
              quantity: 1
            }
          ],
          note: '',
          subject: '',
          submit: null
        },
        validationSchema: Yup.object().shape({
          items: Yup.array().of(Yup.object().shape({
            description: Yup.string().max(255).required('Service description is required'),
            quantity: Yup.number().min(1).required('Quantity is required'),
            price: Yup.number().required('Price is required')
          })),
          note: Yup.string().max(1024),
          subject: Yup.string().max(255).required('Subject is required')
        }),
        onSubmit: async (values, helpers) => {
          try {
            toast.success('Invoice created');
            helpers.setStatus({ success: true });
            helpers.setSubmitting(false);
          } catch (err) {
            console.error(err);
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
          }
        }
      });
    
      const handleAddItem = () => {
        formik.setFieldValue('items', [
          ...formik.values.items, {
            description: '',
            price: '',
            quantity: 1
          }
        ]);
      };
    
      const handleDeleteItem = (itemIndex) => {
        if (formik.values.items.length > 1) {
          formik.setFieldValue('items',
            formik.values.items.filter((item, index) => index !== itemIndex));
        }
      };
    
      const totalInvoicePrice = formik.values.items.reduce((acc, item) => acc
        + (Number.parseFloat(item.price) * item.quantity), 0);
    
      const getItemError = (index, property) => formik?.touched?.items
        && formik?.errors?.items
        && formik?.touched?.items[index]?.[property]
        && formik?.errors?.items[index]?.[property];
    
    return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        flexGrow: 1
      }}
    >
          <form onSubmit={formik.handleSubmit}>
            <CardContent>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <InputField
                    disabled
                    fullWidth
                    label="Customer Name"
                    name="customerName"
                    onBlur={formik.handleBlur}
                    value={lead.name}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <InputField
                    disabled
                    fullWidth
                    label="Customer Number"
                    name="customer Number"
                    onBlur={formik.handleBlur}
                    value={lead.phone}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <InputField
                    disabled
                    fullWidth
                    label="Customer Address"
                    name="customer Address"
                    onBlur={formik.handleBlur}
                    value={lead.address}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <DateField
                    error={Boolean(formik.touched.issueDate && formik.errors.issueDate)}
                    fullWidth
                    helperText={formik.touched.issueDate && formik.errors.issueDate}
                    label="Issued Date"
                    name="issueDate"
                    onChange={(date) => formik.setFieldValue('issueDate', date)}
                    value={formik.values.issueDate}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Divider />
                </Grid>
                {formik.values.items.map((item, index) => {
                  const totalPrice = Number.parseFloat(item.price) * item.quantity;

                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={index}>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <InputField
                          error={Boolean(getItemError(index, 'description'))}
                          fullWidth
                          helperText={getItemError(index, 'description')}
                          label="Item"
                          name={`items[${index}].description`}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          placeholder="Service description"
                          value={item.description}
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sx={{ display: 'flex' }}
                      >
                        <Grid
                          container
                          spacing={2}
                        >
                          <Grid
                            item
                            xs={4}
                          >
                            <InputField
                              error={Boolean(getItemError(index, 'quantity'))}
                              fullWidth
                              helperText={getItemError(index, 'quantity')}
                              label="Qty"
                              name={`items[${index}].quantity`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={item.quantity}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <InputField
                              error={Boolean(getItemError(index, 'price'))}
                              fullWidth
                              helperText={getItemError(index, 'price')}
                              label="Price"
                              name={`items[${index}].price`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={item.price}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">$</InputAdornment>
                                )
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <InputField
                              disabled
                              fullWidth
                              label="Total"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={Number.isNaN(totalPrice) ? '' : totalPrice}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">$</InputAdornment>
                                )
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            ml: 2,
                            mt: 3
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => handleDeleteItem(index)}
                            type="button"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Fragment>
                  );
                })}
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'grid'
                  }}
                >
                  <Button
                    color="primary"
                    onClick={handleAddItem}
                    startIcon={<Add fontSize="small" />}
                    variant="text"
                    sx={{gridRow: '1', gridColumn: '1/1'}}
                  >
                    Add Item
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Divider />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                <Box>
                <Store/>
                <Typography
                  color="textSecondary"
                  sx={{ mr: 1 }}
                  variant="subtitle2"
                >
                  Internal Price
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  {numeral(totalInvoicePrice).format('$0,0.00')}
                </Typography> 
                </Box> 
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                <LocationCity/>
                <Typography
                  color="textSecondary"
                  sx={{ mr: 1 }}
                  variant="subtitle2"
                >
                  Total Price
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  {numeral(totalInvoicePrice).format('$0,0.00')}
                </Typography> 
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                <Discount/>
                <Typography
                  color="textSecondary"
                  sx={{ mr: 1 }}
                  variant="subtitle2"
                >
                  STC Discount
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  {numeral(totalInvoicePrice).format('$0,0.00')}
                </Typography> 
                </Box> 
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                <CreditCard/>
                <Typography
                  color="textSecondary"
                  sx={{ mr: 1 }}
                  variant="subtitle2"
                >
                  Final Price
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  {numeral(totalInvoicePrice).format('$0,0.00')}
                </Typography> 
                </Box> 
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Divider />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <InputField
                    error={Boolean(formik.touched.note && formik.errors.note)}
                    fullWidth
                    helperText={formik.touched.note && formik.errors.note}
                    label="Additional Notes"
                    multiline
                    name="note"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="Client notes"
                    rows={4}
                    value={formik.values.note}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                color="primary"
                type="submit"
                variant="contained"
              >
                Create Invoice
              </Button>
            </CardActions>
          </form>
    </Box>
    );
};

LeadSystemSummary.propTypes = {
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    lead: PropTypes.object,
};
