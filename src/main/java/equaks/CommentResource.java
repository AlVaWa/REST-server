package equaks;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jsska on 27.03.2014.
 */
@Path("/comment")
public class CommentResource {

    static ArrayList<BlogComment> comments = new ArrayList<BlogComment>();
    static {
        BlogComment comment = new BlogComment("Aleksander Waage", "This is a comment", "19:19");
        BlogComment comment1 = new BlogComment("Jennifer Skarning", "This is *another* comment", "19:21");

        comments.add(comment);
        comments.add(comment1);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_XML})
    public List<BlogComment> getUser(){
        return comments;
    }

    @PUT
    @Produces(MediaType.TEXT_HTML)
    public String putSomething(){
        return "You tried to put";
    }

    @DELETE
    @Produces(MediaType.TEXT_HTML)
    public String deleteSomething(){
        return "You tried to delete something";
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<BlogComment> postSomething(List<BlogComment> tempComments){
        tempComments.get(0);
        if (tempComments.get(0) != null){
            comments.add(tempComments.get(0));
        }
        return comments;
    }



}
