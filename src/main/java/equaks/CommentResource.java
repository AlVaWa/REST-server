package equaks;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jsska on 27.03.2014.
 */
@Path("/comment")
public class CommentResource {

    static ArrayList<BlogComment> comments = new ArrayList<BlogComment>();
    static {
        BlogComment comment = new BlogComment("1", "Aleksander Waage", "This is a comment", "19:19");
        BlogComment comment1 = new BlogComment("2", "Jennifer Skarning", "This is *another* comment", "19:21");

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
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteSomething(@FormParam("id") String id){
        BlogComment commentToBeDeleted = null;
        for (BlogComment comment : comments) {
            if (comment.getId().equals(id)){
                commentToBeDeleted = comment;
            }
        }

        if (commentToBeDeleted != null){
            comments.remove(commentToBeDeleted);
        }

    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<BlogComment> postSomething(List<BlogComment> tempComments){
        SecureRandom random = new SecureRandom();
        tempComments.get(0).setId(new BigInteger(130, random).toString(32));

        if (tempComments.get(0) != null){

            comments.add(tempComments.get(0));

        }
        return comments;
    }



}
