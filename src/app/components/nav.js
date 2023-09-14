import { Pagination } from '@mui/material';

export default function Nav({navTitle, setCurrentPage}) {
    return (
      <>
       <div className='flex grid grid-rows-2 gap-4 w-full h-3/4 my-auto'>
          <div className='flex text-black items-center justify-center my-auto m-0'>
            <h4 className='m-0 text-center'>{navTitle}</h4>
          </div>
          <Pagination
            className='flex items-center justify-center m-0 w-100 my-auto h-1/4'
            count={4}
            color="primary"
            hideNextButton={true}
            hidePrevButton={true}
            onClick={(e) => setCurrentPage(e.target.innerText)}
          />
        </div>
      </>
    )
}