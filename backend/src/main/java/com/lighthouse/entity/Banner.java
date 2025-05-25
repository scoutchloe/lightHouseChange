package com.lighthouse.entity;

/**
 * 轮播图实体类
 */
public class Banner {
    private Long id;
    private String title;
    private String image;
    private String link;
    private Integer sort;
    private Boolean status;
    private Boolean isTabBar;
    private String description;

    public Banner() {}

    public Banner(Long id, String title, String image, String link, Integer sort, Boolean status,boolean isTabBar, String description) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.link = link;
        this.sort = sort;
        this.status = status;
        this.isTabBar = isTabBar;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Boolean getIsTabBar() {
        return isTabBar;
    }

    public void setIsTabBar(Boolean status) {
        this.isTabBar = isTabBar;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Banner{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", image='" + image + '\'' +
                ", link='" + link + '\'' +
                ", sort=" + sort +
                ", status=" + status +
                ", description='" + description + '\'' +
                '}';
    }
} 