package example.generics.persist.hsqldb;

import example.generics.models.Episode;
import example.generics.persist.api.EpisodeDao;
import example.generics.persist.api.PageContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import javax.sql.DataSource;
import java.util.List;

public class EpisodeDaoImpl extends JdbcDaoSupport implements EpisodeDao{

    Logger log = LoggerFactory.getLogger(EpisodeDaoImpl.class);

    final static String TABLE_NAME = "EPISODES";

    public EpisodeDaoImpl(DataSource dataSource) {

        super();

        setDataSource(dataSource);

        log.info("Created HSQLDB Implementation of EpisodeDao");

    }

    @Override
    public Episode create(Episode episode) {

        log.debug("Attempting to create episode {}", episode);

        //Note: Remember that spring doesn't generate ID. The database generates the next id. Make sure the database
        // has a trigger or autoincrement facility on the ID column.
        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(getDataSource()).withTableName(TABLE_NAME)
                .usingGeneratedKeyColumns("ID");

        SqlParameterSource parameters = new BeanPropertySqlParameterSource(episode);

        Number id = simpleJdbcInsert.executeAndReturnKey(parameters);
        episode.setId(id.intValue());
        return episode;
    }

    @Override
    public Episode findById(Integer id) {

        log.debug("Attempting to find episode by id {}", id);

        List<Episode> episodes = getJdbcTemplate().query(String.format("SELECT * from %s WHERE ID=%d", TABLE_NAME, id),
                BeanPropertyRowMapper.newInstance(Episode.class));

        return episodes.get(0);

    }

    @Override
    public List<Episode> findAll(PageContext page) {

        log.debug("Attempting to find all episodes limit {}, offset {}", page.getSize(), page.getPage()*page.getSize());

        return getJdbcTemplate().query(String.format("SELECT * FROM %s LIMIT %d OFFSET %d", TABLE_NAME, page.getSize(), page.getPage()*page.getSize()),
                BeanPropertyRowMapper.newInstance(Episode.class));
    }

    @Override
    public Episode update(Episode episode) {

    log.debug("Attempting to update episode {}", episode);

    String sql = String.format("UPDATE %s SET TITLE = ?, SUMMARY = ?, EPISODENUM = ? WHERE ID = ?",TABLE_NAME);

        int result = getJdbcTemplate().update(sql, episode.getTitle(), episode.getSummary(), episode.getEpisodeNum(), episode.getId());

        if(result == 1) {

            return episode;

        } else {
            //TODO: really shouldn't return null here.
            log.error("Update was not successful: {}", sql);
            return null;
        }
    }

    @Override
    public void delete(Episode episode) {

        log.debug("Attempting to delete episode {}", episode);

        getJdbcTemplate().execute(String.format("DELETE FROM %s WHERE ID = %d", TABLE_NAME, episode.getId()));

    }

}
