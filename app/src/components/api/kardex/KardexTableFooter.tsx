import Paginator from '../../ui/Paginator';

interface Props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  kardexCount: number;
}

const KardexTableFooter = ({ page, setPage, kardexCount}: Props) => {

  return (

    <>
      <Paginator
        page={page}
        setPage={setPage}
        itemsCount={kardexCount} 
      
      />
    </>
  );
};

export default KardexTableFooter;
