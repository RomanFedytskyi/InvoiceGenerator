
const style2 = {
  page: {
    padding: 48,
    fontSize: 10.5,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
    color: '#111',
    backgroundColor: '#fdfdfd',
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center' as 'center',
    textTransform: 'uppercase' as 'uppercase',
    fontWeight: 'bold' as 'bold',
    color: '#0070f3',
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    color: '#0070f3',
  },
  section: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
  },
  block: {
    flexDirection: 'column' as 'column',
    flex: 1,
    marginTop: 20,
    gap: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 12,
  },
  tableRow: {
    flexDirection: 'row' as 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#FFFFFF',
  },
  cell: {
    padding: 10,
    flex: 1,
    color: '#555',
  },
  rightCell: {
    textAlign: 'right' as 'right',
  },
  boldCell: {
    fontWeight: 'bold' as 'bold',
  },
  totalSection: {
    marginTop: 12,
    textAlign: 'right' as 'right',
    fontSize: 13,
    fontWeight: 'bold' as 'bold',
    color: '#000',
  },
  paymentDetails: {
    marginTop: 32,
    fontSize: 10.2,
    lineHeight: 1.5,
    color: '#666',
  },
  label: {
    fontWeight: 'bold' as 'bold',
    color: '#0070f3',
  },
};

export default style2;
