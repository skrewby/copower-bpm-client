import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  MenuItem
} from '@mui/material';
import { InputField } from '../form/input-field';

const sourceOptions = [
  {
    label: 'Local Champ',
    value: 'Local Champ'
  },
  {
    label: 'Online',
    value: 'Online'
  },
  {
    label: 'Solar Market',
    value: 'Solar Market'
  },
  {
    label: 'Self Gen',
    value: 'Self Gen'
  }
];

export const LeadInfoDialog = (props) => {
  const { open, onClose, lead } = props;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: lead?.name || '',
      address: lead?.address || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      source: lead?.source || '',
      comment: lead?.comment || '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(255).required('Name is required'),
      address: Yup.string().max(255).required('Address is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      phone: Yup.string().max(255).required('Phone number is required'),
      source: Yup.string().max(255).required('Lead source is required'),
      comment: Yup.string().max(255).default(''),
    }),
    onSubmit: async (values, helpers) => {
      try {
        toast.success('Lead updated');
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        onClose?.();
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: '100%'
        }
      }}
      TransitionProps={{
        onExited: () => formik.resetForm()
      }}
    >
      <DialogTitle>
        Edit Lead
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="name"
              value={formik.values.name}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.address && formik.errors.address)}
              fullWidth
              helperText={formik.touched.address && formik.errors.address}
              label="Address"
              name="address"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              fullWidth
              helperText={formik.touched.phone && formik.errors.phone}
              label="Phone number"
              name="phone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.source && formik.errors.source)}
              fullWidth
              helperText={formik.touched.source && formik.errors.source}
              label="Source"
              name="source"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              select
              value={formik.values.source}
            >
              {sourceOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </InputField>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.comment && formik.errors.comment)}
              fullWidth
              helperText={formik.touched.comment && formik.errors.comment}
              label="Comment"
              name="comment"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.comment}
            />
          </Grid>
          {formik.errors.submit && (
            <Grid
              item
              xs={12}
            >
              <FormHelperText error>
                {formik.errors.submit}
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => { formik.handleSubmit(); }}
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LeadInfoDialog.defaultProps = {
  open: false
};

LeadInfoDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  lead: PropTypes.object
};
