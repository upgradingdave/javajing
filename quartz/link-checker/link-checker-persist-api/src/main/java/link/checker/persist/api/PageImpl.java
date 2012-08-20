package link.checker.persist.api;

/**
 * 0 based indexes
 */
public class PageImpl implements PageContext {

    int page;
    int size;

    public PageImpl(int page, int size) {

        if(page < 0 || size < 0) {
            throw new IllegalStateException("Page number and size of results must be >= 0");
        }

        this.page = page;
        this.size = size;
    }

    public int getEnd(){

        return ((page+1) * size)-1;

    }

    /**
     * Start is zero index based. For ex, if page=2, size=10, then start is 20
     * @return
     */
    public int getStart(){

        return ((page+1) * size) - size;

    }

    @Override
    public int getPage() {
        return page;
    }

    @Override
    public int getSize() {
        return size;
    }

}
