import { Request, Response } from 'express';
import { query } from '../db.js';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT p.*, u.username as author_name, c.name as category_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await query(
      `SELECT p.*, u.username as author_name, c.name as category_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, excerpt, category_id, status } = req.body;

    const result = await query(
      `INSERT INTO posts (title, slug, content, excerpt, category_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, slug, content, excerpt, category_id, status || 'draft']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};
